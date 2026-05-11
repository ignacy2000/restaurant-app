package storage

import (
	"context"
	"fmt"
	"io"
	"strings"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Client struct {
	mc             *minio.Client
	bucket         string
	publicEndpoint string
}

type Config struct {
	Endpoint       string
	PublicEndpoint string
	AccessKey      string
	SecretKey      string
	Bucket         string
	UseSSL         bool
}

func New(cfg Config) (*Client, error) {
	mc, err := minio.New(cfg.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.AccessKey, cfg.SecretKey, ""),
		Secure: cfg.UseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("init minio client: %w", err)
	}
	return &Client{
		mc:             mc,
		bucket:         cfg.Bucket,
		publicEndpoint: strings.TrimRight(cfg.PublicEndpoint, "/"),
	}, nil
}

func (c *Client) EnsureBucket(ctx context.Context) error {
	exists, err := c.mc.BucketExists(ctx, c.bucket)
	if err != nil {
		return fmt.Errorf("check bucket: %w", err)
	}
	if !exists {
		if err := c.mc.MakeBucket(ctx, c.bucket, minio.MakeBucketOptions{}); err != nil {
			return fmt.Errorf("create bucket: %w", err)
		}
	}
	policy := fmt.Sprintf(`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::%s/*"]}]}`, c.bucket)
	if err := c.mc.SetBucketPolicy(ctx, c.bucket, policy); err != nil {
		return fmt.Errorf("set bucket policy: %w", err)
	}
	return nil
}

func (c *Client) Upload(ctx context.Context, objectKey string, r io.Reader, size int64, contentType string) (string, error) {
	_, err := c.mc.PutObject(ctx, c.bucket, objectKey, r, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", fmt.Errorf("put object: %w", err)
	}
	return c.PublicURL(objectKey), nil
}

func (c *Client) PublicURL(objectKey string) string {
	return fmt.Sprintf("%s/%s/%s", c.publicEndpoint, c.bucket, objectKey)
}
