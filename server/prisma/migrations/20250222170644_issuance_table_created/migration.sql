-- CreateTable
CREATE TABLE "Issuance" (
    "issuance_id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "issuance_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuance_member" INTEGER NOT NULL,
    "issued_by" TEXT NOT NULL,
    "target_return_date" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + interval '7 days'),
    "issuance_status" TEXT NOT NULL,

    CONSTRAINT "Issuance_pkey" PRIMARY KEY ("issuance_id")
);

-- AddForeignKey
ALTER TABLE "Issuance" ADD CONSTRAINT "Issuance_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issuance" ADD CONSTRAINT "Issuance_issuance_member_fkey" FOREIGN KEY ("issuance_member") REFERENCES "Member"("mem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
