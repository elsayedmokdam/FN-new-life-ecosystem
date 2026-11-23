import { getCardsService } from "./getCards.service";
import { createCardService } from "./createCard.service";
import { getCardService } from "./getCard.service";
import { updateCardService } from "./updateCard.service";
import { setCardStatusService } from "./setCardStatus.service";
import { getCardSummaryService } from "./getCardSummary.service";

export const CardsRepo = {
  getCards: getCardsService,
  createCard: createCardService,
  getCard: getCardService,
  updateCard: updateCardService,
  setCardStatus: setCardStatusService,
  getCardSummary: getCardSummaryService,
};
