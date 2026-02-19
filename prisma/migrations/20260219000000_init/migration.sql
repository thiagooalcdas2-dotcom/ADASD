-- Create enums
CREATE TYPE "Role" AS ENUM ('CLIENT', 'STAFF', 'ADMIN', 'ADMIN_TAZ');
CREATE TYPE "OrderType" AS ENUM ('DELIVERY', 'PICKUP', 'TABLE');
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED');
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE "SenderRole" AS ENUM ('CLIENT', 'STAFF', 'ADMIN', 'ADMIN_TAZ');
CREATE TYPE "ExpenseCategory" AS ENUM ('RENT', 'SUPPLIES', 'PAYROLL', 'UTILITIES', 'MAINTENANCE', 'MARKETING', 'OTHER');
CREATE TYPE "ExpenseMethod" AS ENUM ('CASH', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CLIENT',
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MenuCategory" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "MenuItem" (
  "id" TEXT PRIMARY KEY,
  "categoryId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" "OrderType" NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
  "total" DECIMAL(10,2) NOT NULL,
  "paid" BOOLEAN NOT NULL DEFAULT FALSE,
  "notes" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "menuItemId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPrice" DECIMAL(10,2) NOT NULL,
  "notes" TEXT
);

CREATE TABLE "Reservation" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "dateTime" TIMESTAMP(3) NOT NULL,
  "peopleCount" INTEGER NOT NULL,
  "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
  "notes" TEXT
);

CREATE TABLE "Ticket" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
  "subject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TicketMessage" (
  "id" TEXT PRIMARY KEY,
  "ticketId" TEXT NOT NULL,
  "senderRole" "SenderRole" NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Expense" (
  "id" TEXT PRIMARY KEY,
  "createdByUserId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "category" "ExpenseCategory" NOT NULL,
  "method" "ExpenseMethod" NOT NULL,
  "vendor" TEXT,
  "notes" TEXT
);

CREATE TABLE "RevenueAdjustment" (
  "id" TEXT PRIMARY KEY,
  "createdByUserId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "reason" TEXT NOT NULL
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "actorUserId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "beforeJson" JSONB,
  "afterJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory"("id");
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id");
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE;
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id");
ALTER TABLE "RevenueAdjustment" ADD CONSTRAINT "RevenueAdjustment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id");
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id");
