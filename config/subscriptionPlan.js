module.exports = [
    {
        id: 'basic-annual',
        name: 'Basic Annual',
        price: 1,
        duration: 365, // days
        features: ['Feature 1', 'Feature 2']
    },
    {
        id: 'premium-annual',
        name: 'Premium Annual',
        price: 2,
        duration: 365, // days
        features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
    },
    {
        id: 'lifetime',
        name: 'Lifetime',
        price: 3,
        duration: null, // null indicates lifetime
        features: ['All Features', 'Lifetime Updates']
    }
];