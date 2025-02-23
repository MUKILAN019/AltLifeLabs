-- CreateTable
CREATE TABLE "Member" (
    "mem_id" SERIAL NOT NULL,
    "mem_name" TEXT NOT NULL,
    "mem_phone" TEXT NOT NULL,
    "mem_email" TEXT NOT NULL,
    "mem_password" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("mem_id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "membership_id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("membership_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_mem_email_key" ON "Member"("mem_email");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("mem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
