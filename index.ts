import { PublicKey } from "@solana/web3.js"
import BN from "bn.js"

class GlobalState {
    admin: PublicKey;
    protocolFeeBps: number;
    minBetLamports: BN;
    maxTaxBps: number;
    feeVault: PublicKey;

    constructor(
        admin: PublicKey,
        protocolFeeBps: number,
        minBetLamports: BN,
        maxTaxBps: number,
        feeVault: PublicKey
    ) {
        this.admin = admin;
        this.protocolFeeBps = protocolFeeBps;
        this.minBetLamports = minBetLamports;
        this.maxTaxBps = maxTaxBps;
        this.feeVault = feeVault;
    }

}

type Round = {
    tokenMint: PublicKey,
    startTime: number,
    endTime: number,
    totalPoolLamports: BN,
    finalMcapLamports: BN,
    has_ended: boolean,
}

class RoundManager {
    rounds: Record<number, Round> = {};

    startRound(roundId: number, tokenMint: PublicKey, tokenVaultAddress: PublicKey, solVaultAddress: PublicKey, windowSeconds: number) {
        const now = Math.floor(Date.now() / 1000)
        const endTime = now + windowSeconds

        const currentRound: Round = {
            tokenMint: tokenMint,
            startTime: now,
            endTime: endTime,
            totalPoolLamports: new BN(0),
            finalMcapLamports: new BN(0),
            has_ended: false,
        };

        this.rounds[roundId] = currentRound;
        console.log(`[EVENT] RoundStarted => {
            roundId: ${roundId},
            tokenMint: ${tokenMint.toBase58()},
            startTime: ${now},
            endTime: ${endTime},
            windowSeconds: ${windowSeconds}
            }`
        );
    }

    getRound(roundId: number): Round | undefined {
        return this.rounds[roundId]
    }

    placeBet(roundId: number, user: PublicKey, betSolAmount: BN, guessedMcapSol: BN) {
        const round = this.getRound(roundId);
        if (!round) throw new Error("Round not found")

    }
}

type Bet = {
    userAddress: PublicKey,
    betSolAmount: BN,
    guessedMcapSol: BN,
    placedAt: number,
    taxBpsApplied: number,
}

function main() {
    const state = new GlobalState(
        new PublicKey("G87jkGvYEA4vmeAhJe74CZ7LVX9JqdTSWo8mYwGMC19X"),
        500,
        new BN(500_000_000),
        10_000,
        new PublicKey("8rvJ6ibki7XWLQDnNAJJ9dxXV8SAEDmScq6z9TZRchAE")
    );

    const rm = new RoundManager();

    const coinAddress = new PublicKey("39zSVsSHFqNhARbVh6n8ZF78nCmhV3gSg8D39xhBNe73");
    const coinBaseVaultAddress = new PublicKey("7Dimu1QYa1No9c8VUj975hYive5QtM5yobZAamA6hjzr")
    const coinQuoteVaultAddress = new PublicKey("D7UUjW5VnSgqw22AgCsnP2paGAcRWiYye4bdh3JuAFJW")

    rm.startRound(1, coinAddress, coinBaseVaultAddress, coinQuoteVaultAddress, 600)
}

main()
