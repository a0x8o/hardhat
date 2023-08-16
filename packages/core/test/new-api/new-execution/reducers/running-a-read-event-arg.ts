import { assert } from "chai";

import { DeploymentState } from "../../../../src/new-api/internal/new-execution/types/deployment-state";
import {
  ExecutionSateType,
  ExecutionStatus,
  ReadEventArgumentExecutionState,
} from "../../../../src/new-api/internal/new-execution/types/execution-state";
import {
  JournalMessageType,
  ReadEventArgExecutionStateInitializeMessage,
} from "../../../../src/new-api/internal/new-execution/types/messages";
import { findReadEventArgumentExecutionStateBy } from "../../../../src/new-api/internal/new-execution/views/find-read-event-argument-execution-state-by";

import { applyMessages } from "./utils";

describe("DeploymentStateReducer", () => {
  describe("running a read event arg", () => {
    const exampleAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

    let updatedDeploymentState: DeploymentState;
    let updatedReadEventExState: ReadEventArgumentExecutionState;

    const initializeReadEventArgExecutionStateMessage: ReadEventArgExecutionStateInitializeMessage =
      {
        type: JournalMessageType.READ_EVENT_ARGUMENT_EXECUTION_STATE_INITIALIZE,
        futureId: "ReadEventArg1",
        strategy: "basic",
        dependencies: [],
        artifactFutureId: "ReadEventArg1",
        eventName: "event1",
        argumentName: "arg1",
        txToReadFrom: "0x1234",
        emitterAddress: exampleAddress,
        eventIndex: 1,
        result: [BigInt(1), "0x1234"],
      };

    describe("initialization", () => {
      beforeEach(() => {
        updatedDeploymentState = applyMessages([
          initializeReadEventArgExecutionStateMessage,
        ]);

        updatedReadEventExState = findReadEventArgumentExecutionStateBy(
          updatedDeploymentState,
          "ReadEventArg1"
        );
      });

      it("should populate a read event argument execution state for the future", () => {
        assert.equal(
          updatedReadEventExState.type,
          ExecutionSateType.READ_EVENT_ARGUMENT_EXECUTION_STATE
        );
      });

      it("should set the contract at as already succeeded", () => {
        assert.equal(updatedReadEventExState.status, ExecutionStatus.SUCCESS);
      });

      it("should record the event arg value as the result", () => {
        assert.deepStrictEqual(updatedReadEventExState.result, [
          BigInt(1),
          "0x1234",
        ]);
      });

      it("should record the details of the event being looked up", () => {
        assert.equal(updatedReadEventExState.artifactFutureId, "ReadEventArg1");
        assert.equal(updatedReadEventExState.eventName, "event1");
        assert.equal(updatedReadEventExState.argumentName, "arg1");
        assert.equal(updatedReadEventExState.txToReadFrom, "0x1234");
        assert.equal(updatedReadEventExState.emitterAddress, exampleAddress);
        assert.equal(updatedReadEventExState.eventIndex, 1);
      });
    });
  });
});
