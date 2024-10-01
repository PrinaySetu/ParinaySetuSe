module.exports = [
    {
        id: 'basic-annual',
        name: 'Basic Annual',
        price: 1,
        duration: 365, // days
        features: ['Information about the biodata of the other party will be made available for 1 year or till the marriage, whichever is earlier.']
    },
    {
        id: 'premium-annual',
        name: 'Premium Annual',
        price: 2,
        duration: 730, // days
        features: ['Verified information of the biodata of the other party will be provided for 2 years or till the marriage, whichever is earlier.']
    },
    {
        id: 'lifetime',
        name: 'Lifetime',
        price: 3,
        duration: 730, // null indicates lifetime
        features: [' Verified information about the biodata of the other party will be given.', 
            'Information will be provided for 2 years or till marriage, whichever is earlier.',
        'If necessary, both the parties can be met at the Bureaus address. (maximum 3 hits)']
    },
    {
        id:'lifetime-premium',
        name:'Lifetime Premium',
        price: 4,
        duration: null,
        features:['Verified information about the biodata of the other party will be given',
            'This information will be made available till the marriage takes place.'
            ,' If required, both the parties can be met at the Bureaus address. (maximum 5 hits)',
        ' If necessary, mediation between both the parties can be done by the advisor/consultant of our bureau.']
    }
];
