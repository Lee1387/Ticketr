ALTER TABLE "users" ADD COLUMN "password_hash" varchar(255) DEFAULT '$argon2id$v=19$m=19456,t=2,p=1$PqLAEPHKXubb2Bhx4VhokA$lW5C2w09mk+PnS0mDdS7tZlcZae9Rb7EiqwqrqYnlbQ' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP DEFAULT;
