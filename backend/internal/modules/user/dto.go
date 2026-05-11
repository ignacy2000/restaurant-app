package user

type CreateReq struct {
	Email    string `json:"email"    binding:"required,email,max=320"`
	Password string `json:"password" binding:"required,min=8,max=128"`
}

type Response struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	CreatedAt string `json:"created_at"`
}
