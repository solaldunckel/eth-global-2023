export const GetNftHoldersQuery = `query GetNftHolders($address: Address, $blockchain: TokenBlockchain!, $cursor: String) {
	TokenBalances(
		input: {filter: {tokenAddress: {_eq: $address}}, blockchain: $blockchain, limit: 200, cursor: $cursor}
	) {
		TokenBalance {
			owner {
				addresses
			}
		}
		pageInfo {
			nextCursor
			prevCursor
		}
	}
}`;
