const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const anchor = require("@project-serum/anchor");
require("dotenv").config();
const NETWORK_URL = process.env.NETWORK_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

(async () => {
    // Connect to cluster
    var connection = new web3.Connection(
        NETWORK_URL,
        'confirmed',
    );

    const fromWallet = anchor.web3.Keypair.fromSecretKey(
        Buffer.from(
            JSON.parse(PRIVATE_KEY)
        )
    );

    console.log('fromWallet.publicKey ==> ', fromWallet.publicKey.toString());
    // create new token mint
    try {
        let mint = await splToken.Token.createMint(
            connection,
            fromWallet,
            fromWallet.publicKey,
            null,
            0,
            splToken.TOKEN_PROGRAM_ID,
        );

        console.log('mint ==> ', mint);

        try {
            // get the token account of the fromWallet Solana address, if it does not exist, create it
            let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
                fromWallet.publicKey,
            );
            console.log('fromTokenAccount ==> ', fromTokenAccount);

            try {
                // minting 1 new token to the "fromTokenAccount" account we just returned/created
                await mint.mintTo(
                    fromTokenAccount.address, //who it goes to
                    fromWallet.publicKey, // minting authority
                    [], // multisig
                    1, // how many
                );
                console.log('Total Token ==> ', 1);
                try {
                    await mint.setAuthority(
                        mint.publicKey,
                        null,
                        "MintTokens",
                        fromWallet.publicKey,
                        []
                    );
                    console.log('Done');
                } catch (e4) {
                    console.log('error 4 ==> ', e4);        
                }
            } catch (e3) {
                console.log('error 3 ==> ', e3);    
            }
        } catch (e2) {
            console.log('error 2 ==> ', e2);
        }
    } catch (e1) {
        console.log('error 1 ==> ', e1);
    }
})();
