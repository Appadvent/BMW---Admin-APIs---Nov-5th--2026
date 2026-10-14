-- CreateTable
CREATE TABLE "FAQSection" (
    "id" SERIAL NOT NULL,
    "heading" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQItem" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FAQItem" ADD CONSTRAINT "FAQItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "FAQSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
