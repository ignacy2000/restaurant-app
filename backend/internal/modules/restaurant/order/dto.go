package order

type ItemReq struct {
	Name     string `json:"name"     binding:"required,max=255"`
	Quantity int    `json:"quantity" binding:"required,min=1,max=999"`
	Notes    string `json:"notes"    binding:"max=500"`
}

type CreateReq struct {
	Items      []ItemReq `json:"items"       binding:"required,min=1,max=100,dive"`
	Notes      string    `json:"notes"       binding:"max=1000"`
	GuestEmail string    `json:"guest_email" binding:"required,email,max=320"`
}

type ConfirmResponse struct {
	OrderID      string `json:"order_id"`
	RestaurantID string `json:"restaurant_id"`
	TableID      string `json:"table_id"`
}

type UpdateStatusReq struct {
	Status OrderStatus `json:"status" binding:"required,oneof=awaiting_confirmation pending confirmed preparing ready delivered cancelled"`
}

type ItemResponse struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
	Notes    string `json:"notes,omitempty"`
}

type Response struct {
	ID           string         `json:"id"`
	RestaurantID string         `json:"restaurant_id"`
	TableID      string         `json:"table_id"`
	Status       OrderStatus    `json:"status"`
	Notes        string         `json:"notes,omitempty"`
	Items        []ItemResponse `json:"items"`
	CreatedAt    string         `json:"created_at"`
}
