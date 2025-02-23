-- CreateTable
CREATE TABLE "Collection" (
    "collection_id" SERIAL NOT NULL,
    "collection_name" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("collection_id")
);

-- CreateTable
CREATE TABLE "Book" (
    "book_id" SERIAL NOT NULL,
    "book_name" TEXT NOT NULL,
    "book_cat_id" INTEGER NOT NULL,
    "book_collection_id" INTEGER NOT NULL,
    "book_launch_date" TIMESTAMP(3) NOT NULL,
    "book_publisher" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "cat_id" SERIAL NOT NULL,
    "cat_name" TEXT NOT NULL,
    "sub_cat_name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("cat_id")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_book_collection_id_fkey" FOREIGN KEY ("book_collection_id") REFERENCES "Collection"("collection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_book_cat_id_fkey" FOREIGN KEY ("book_cat_id") REFERENCES "Category"("cat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
