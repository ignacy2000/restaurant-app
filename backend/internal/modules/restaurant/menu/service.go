package menu

import (
	"context"
	"errors"
	"fmt"
	"io"
)

var (
	ErrNotFound  = errors.New("restaurant not found")
	ErrForbidden = errors.New("not the restaurant owner")
)

type restaurantRepo interface {
	FindOwnerID(ctx context.Context, id string) (string, error)
}

type imageStore interface {
	Upload(ctx context.Context, objectKey string, r io.Reader, size int64, contentType string) (string, error)
}

type Service struct {
	repo           *Repository
	restaurantRepo restaurantRepo
	images         imageStore
}

func NewService(repo *Repository, restaurantRepo restaurantRepo, images imageStore) *Service {
	return &Service{repo: repo, restaurantRepo: restaurantRepo, images: images}
}

func (s *Service) Create(ctx context.Context, restaurantID, userID string, req CreateReq) (*Response, error) {
	ownerID, err := s.restaurantRepo.FindOwnerID(ctx, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("find restaurant: %w", err)
	}
	if ownerID == "" {
		return nil, ErrNotFound
	}
	if ownerID != userID {
		return nil, ErrForbidden
	}

	m := &Menu{
		RestaurantID: restaurantID,
		Name:         req.Name,
		Description:  req.Description,
	}
	if err := s.repo.Create(ctx, m); err != nil {
		return nil, fmt.Errorf("create menu: %w", err)
	}
	return toResponse(m), nil
}

func (s *Service) Update(ctx context.Context, menuID, userID string, req UpdateReq) (*Response, error) {
	restaurantID, err := s.repo.FindMenuRestaurantID(ctx, menuID)
	if err != nil {
		return nil, fmt.Errorf("find menu: %w", err)
	}
	if restaurantID == "" {
		return nil, ErrNotFound
	}
	ownerID, err := s.restaurantRepo.FindOwnerID(ctx, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("find owner: %w", err)
	}
	if ownerID != userID {
		return nil, ErrForbidden
	}
	m := &Menu{ID: menuID, Name: req.Name, Description: req.Description}
	if err := s.repo.UpdateMenu(ctx, m); err != nil {
		return nil, fmt.Errorf("update menu: %w", err)
	}
	return toResponse(m), nil
}

func (s *Service) GetByRestaurant(ctx context.Context, restaurantID string) ([]Response, error) {
	menus, err := s.repo.FindByRestaurantID(ctx, restaurantID)
	if err != nil {
		return nil, err
	}
	responses := make([]Response, len(menus))
	for i, m := range menus {
		responses[i] = *toResponse(&m)
	}
	return responses, nil
}

func (s *Service) CreateItem(ctx context.Context, menuID, userID string, req CreateItemReq) (*ItemResponse, error) {
	restaurantID, err := s.repo.FindMenuRestaurantID(ctx, menuID)
	if err != nil {
		return nil, fmt.Errorf("find menu: %w", err)
	}
	if restaurantID == "" {
		return nil, ErrNotFound
	}
	ownerID, err := s.restaurantRepo.FindOwnerID(ctx, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("find owner: %w", err)
	}
	if ownerID != userID {
		return nil, ErrForbidden
	}
	item := &MenuItem{
		MenuID:      menuID,
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		Position:    req.Position,
		ImageURL:    req.ImageURL,
	}
	if err := s.repo.CreateItem(ctx, item); err != nil {
		return nil, fmt.Errorf("create item: %w", err)
	}
	return toItemResponse(item), nil
}

func (s *Service) UpdateItem(ctx context.Context, itemID, userID string, req UpdateItemReq) (*ItemResponse, error) {
	restaurantID, err := s.repo.FindItemRestaurantID(ctx, itemID)
	if err != nil {
		return nil, fmt.Errorf("find item: %w", err)
	}
	if restaurantID == "" {
		return nil, ErrNotFound
	}
	ownerID, err := s.restaurantRepo.FindOwnerID(ctx, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("find owner: %w", err)
	}
	if ownerID != userID {
		return nil, ErrForbidden
	}
	item := &MenuItem{
		ID:          itemID,
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		Position:    req.Position,
		ImageURL:    req.ImageURL,
	}
	if err := s.repo.UpdateItem(ctx, item); err != nil {
		return nil, fmt.Errorf("update item: %w", err)
	}
	return toItemResponse(item), nil
}

func (s *Service) GetItemsByRestaurant(ctx context.Context, restaurantID string) ([]ItemResponse, error) {
	items, err := s.repo.FindItemsByRestaurantID(ctx, restaurantID)
	if err != nil {
		return nil, err
	}
	responses := make([]ItemResponse, len(items))
	for i, item := range items {
		responses[i] = *toItemResponse(&item)
	}
	return responses, nil
}

func (s *Service) UploadItemImage(ctx context.Context, itemID, userID string, r io.Reader, size int64, contentType, ext string) (*ItemResponse, error) {
	restaurantID, err := s.repo.FindItemRestaurantID(ctx, itemID)
	if err != nil {
		return nil, fmt.Errorf("find item: %w", err)
	}
	if restaurantID == "" {
		return nil, ErrNotFound
	}
	ownerID, err := s.restaurantRepo.FindOwnerID(ctx, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("find owner: %w", err)
	}
	if ownerID != userID {
		return nil, ErrForbidden
	}

	objectKey := fmt.Sprintf("items/%s%s", itemID, ext)
	url, err := s.images.Upload(ctx, objectKey, r, size, contentType)
	if err != nil {
		return nil, fmt.Errorf("upload image: %w", err)
	}
	if err := s.repo.UpdateItemImageURL(ctx, itemID, url); err != nil {
		return nil, fmt.Errorf("update image url: %w", err)
	}

	items, err := s.repo.FindItemsByRestaurantID(ctx, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("reload items: %w", err)
	}
	for _, item := range items {
		if item.ID == itemID {
			return toItemResponse(&item), nil
		}
	}
	return nil, ErrNotFound
}

func (s *Service) DeleteItem(ctx context.Context, itemID, userID string) error {
	restaurantID, err := s.repo.FindItemRestaurantID(ctx, itemID)
	if err != nil {
		return fmt.Errorf("find item: %w", err)
	}
	if restaurantID == "" {
		return ErrNotFound
	}
	ownerID, err := s.restaurantRepo.FindOwnerID(ctx, restaurantID)
	if err != nil {
		return fmt.Errorf("find owner: %w", err)
	}
	if ownerID != userID {
		return ErrForbidden
	}
	return s.repo.DeleteItem(ctx, itemID)
}

func toResponse(m *Menu) *Response {
	return &Response{
		ID:           m.ID,
		RestaurantID: m.RestaurantID,
		Name:         m.Name,
		Description:  m.Description,
		CreatedAt:    m.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func toItemResponse(item *MenuItem) *ItemResponse {
	return &ItemResponse{
		ID:          item.ID,
		MenuID:      item.MenuID,
		Name:        item.Name,
		Description: item.Description,
		Price:       item.Price,
		Position:    item.Position,
		ImageURL:    item.ImageURL,
	}
}
