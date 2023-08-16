import { assertIgnitionInvariant } from "../../../utils/assertions";
import {
  CallExecutionState,
  DeploymentExecutionState,
  StaticCallExecutionState,
} from "../../types/execution-state";
import {
  NetworkInteractionType,
  OnchainInteraction,
} from "../../types/network-interaction";

export function findOnchainInteractionBy(
  executionState:
    | DeploymentExecutionState
    | CallExecutionState
    | StaticCallExecutionState,
  networkInteractionId: number
): OnchainInteraction {
  const onchainInteraction = executionState.networkInteractions.find(
    (interaction) => interaction.id === networkInteractionId
  );

  assertIgnitionInvariant(
    onchainInteraction !== undefined,
    `Expected network interaction ${executionState.id}/${networkInteractionId} to exist, but it did not`
  );

  assertIgnitionInvariant(
    onchainInteraction.type === NetworkInteractionType.ONCHAIN_INTERACTION,
    `Expected network interaction ${executionState.id}/${networkInteractionId} to be an onchain interaction, but instead it was ${onchainInteraction.type}`
  );

  return onchainInteraction;
}
