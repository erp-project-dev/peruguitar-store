import DATA from "@/app/store";

import { Review } from "@/features/types/review.type";

interface ReviewGetCommandProps {
  product_id?: string;
}

export class ReviewGetCommand {
  static handle(input: ReviewGetCommandProps = {}): Review[] {
    const { Reviews } = DATA;
    let result = [...Reviews].sort((a, b) =>
      a.review_date.localeCompare(b.review_date, "es", { sensitivity: "base" })
    );

    if (input?.product_id) {
      result = result.filter(
        (review) => review.product_id === input.product_id
      );
    }

    return result.sort((a, b) => b.review_date.localeCompare(a.review_date));
  }
}
