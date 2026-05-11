package menu

type CreateReq struct {
	Name        string `json:"name"        binding:"required,max=255"`
	Description string `json:"description" binding:"max=2000"`
}

type UpdateReq struct {
	Name        string `json:"name"        binding:"required,max=255"`
	Description string `json:"description" binding:"max=2000"`
}

type Response struct {
	ID           string `json:"id"`
	RestaurantID string `json:"restaurant_id"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	CreatedAt    string `json:"created_at"`
}

type CreateItemReq struct {
	Name        string  `json:"name"        binding:"required,max=255"`
	Description string  `json:"description" binding:"max=2000"`
	Price       float64 `json:"price"       binding:"gte=0,lte=100000"`
	Position    int     `json:"position"    binding:"gte=0,lte=9999"`
	ImageURL    string  `json:"image_url"   binding:"omitempty,url,max=2048"`
}

type UpdateItemReq struct {
	Name        string  `json:"name"        binding:"required,max=255"`
	Description string  `json:"description" binding:"max=2000"`
	Price       float64 `json:"price"       binding:"gte=0,lte=100000"`
	Position    int     `json:"position"    binding:"gte=0,lte=9999"`
	ImageURL    string  `json:"image_url"   binding:"omitempty,url,max=2048"`
}

type ItemResponse struct {
	ID          string  `json:"id"`
	MenuID      string  `json:"menu_id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Position    int     `json:"position"`
	ImageURL    string  `json:"image_url"`
}
