import fs from "fs";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "bn.js";
// import { DEFAULT_DECIMALS, PumpFunSDK, type CreateTokenMetadata } from "pumpdotfun-sdk";
import { act } from "react";
import { PumpFunSDK } from "./pumpdotfun-sdk/src";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

const getProvider = () => {
    const connection = new Connection("http://127.0.0.1:8899");
    const wallet = new NodeWallet(new Keypair());
    return new AnchorProvider(connection, wallet, { commitment: "finalized" });
};

async function createAndBuyCoin() {
    const provider = getProvider()
    const sdk = new PumpFunSDK(provider);
    const conn = provider.connection

    const userKeypair = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(`${process.env.HOME}/.config/solana/id.json`, "utf-8")))
    );
    console.log(userKeypair.publicKey.toString())

    // const mintKeypair = Keypair.generate();
    const base58Secret = process.env.SEED!;
    const mintKeypair = Keypair.fromSecretKey(bs58.decode(base58Secret))
    console.log("Mint", mintKeypair.publicKey.toString())
    // console.log(mintKeypair.publicKey.toString())
    // const sig = await conn.requestAirdrop(mintKeypair.publicKey, 2_000_000_000);
    // await conn.confirmTransaction(sig, "finalized")
    // const balance = await conn.getBalance(mintKeypair.publicKey);
    // console.log(`Balance: ${balance}`);

    const tokenMetadata = {
        name: "TST-7",
        symbol: "TST-7",
        description: "TST-7: This is a test token",
        file: await fs.openAsBlob("./some_image.png")
    }

    const buyAmount = BigInt(1.9 * LAMPORTS_PER_SOL);

    const createResult = await sdk.createAndBuy(
        userKeypair,
        mintKeypair,
        tokenMetadata,
        buyAmount,
    )
}

async function buyCoin() {
    const provider = getProvider()
    const sdk = new PumpFunSDK(provider);
    const conn = provider.connection

    const userKeypair = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(`${process.env.HOME}/.config/solana/id.json`, "utf-8")))
    );
    console.log(userKeypair.publicKey.toString())

    // const mintKeypair = Keypair.generate();
    const base58Secret = process.env.SEED!;
    const mintKeypair = Keypair.fromSecretKey(bs58.decode(base58Secret))

    const buyAmount = BigInt(3.6 * LAMPORTS_PER_SOL);
    const buyRes = await sdk.buy(userKeypair, mintKeypair.publicKey, buyAmount)
}

buyCoin()
