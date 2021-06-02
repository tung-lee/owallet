import React, { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import { ScrollView } from "react-native";
import { SafeAreaFixedPage } from "../../components/page";
import { Card } from "../../components/layout";
import { VotingButton } from "./voting-button";
import { Text } from "react-native-elements";
import { View } from "react-native";
import { parseTime } from "./governance-utils";
import { StateBadge } from "./state-badge";
import { useStore } from "../../stores";
import { Governance } from "@keplr-wallet/stores";
import {
  alignItemsCenter,
  body3,
  flex1,
  flexDirectionRow,
  h6,
  h7,
  justifyContentBetween,
  mb1,
  mb2,
  sf,
} from "../../styles";

export const ProposalDetailsCard: FunctionComponent<{
  proposalId: string;
}> = observer(({ proposalId }) => {
  const { queriesStore, chainStore } = useStore();

  const chainId = chainStore.current.chainId;
  const queries = queriesStore.get(chainId);

  const governance = queries.cosmos.queryGovernance;

  const proposal = governance.getProposal(proposalId);

  return proposal ? (
    <Card style={[{ paddingBottom: 60 }]}>
      <View
        style={sf([
          flexDirectionRow,
          justifyContentBetween,
          alignItemsCenter,
          mb1,
        ])}
      >
        <Text style={sf([h6])}>{`#${proposal.id}`}</Text>
        <StateBadge proposalStatus={proposal.proposalStatus} />
      </View>
      <Text style={sf([h6, mb2])}>{proposal.title}</Text>
      {/* {proposal.proposalStatus !== Governance.ProposalStatus.DEPOSIT_PERIOD ? (
        <BarChart
          labels={["Yes", "No", "NoWithVeto", "Abstain"]}
          data={[
            Number(tally?.yes.locale(false).toString()),
            Number(tally?.no.locale(false).toString()),
            Number(tally?.noWithVeto.locale(false).toString()),
            Number(tally?.abstain.locale(false).toString()),
          ]}
          backgroundColors={["#5e72e4", "#fb6340", "#f5365c", "#212529"]}
        />
      ) : null} */}
      <View style={sf([flexDirectionRow, mb2])}>
        {proposal.proposalStatus ===
        Governance.ProposalStatus.DEPOSIT_PERIOD ? (
          <React.Fragment>
            <View style={flex1}>
              <Text style={sf([h7, mb1])}>Submit Time</Text>
              <Text style={body3}>{parseTime(proposal.raw.submit_time)}</Text>
            </View>
            <View style={flex1}>
              <Text style={sf([h7, mb1])}>Deposit End Time</Text>
              <Text style={body3}>
                {parseTime(proposal.raw.deposit_end_time)}
              </Text>
            </View>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <View style={flex1}>
              <Text style={sf([h7, mb1])}>Voting Start Time</Text>
              <Text style={body3}>
                {parseTime(proposal.raw.voting_start_time)}
              </Text>
            </View>
            <View style={flex1}>
              <Text style={sf([h7, mb1])}>Voting End Time</Text>
              <Text style={body3}>
                {parseTime(proposal.raw.voting_end_time)}
              </Text>
            </View>
          </React.Fragment>
        )}
      </View>
      <Text style={sf([h7, mb1])}>Description</Text>
      <Text style={body3}>{proposal.raw.content.value.description}</Text>
    </Card>
  ) : (
    // TO DO Loading
    <Text>Loading</Text>
  );
});

export const GovernanceDetailsScreeen: FunctionComponent<{
  route: {
    params: { proposalId: string };
  };
}> = observer(({ route }) => {
  const { proposalId } = route.params;
  return (
    <SafeAreaFixedPage>
      <ScrollView>
        <ProposalDetailsCard proposalId={proposalId} />
      </ScrollView>
      <VotingButton proposalId={proposalId} />
    </SafeAreaFixedPage>
  );
});