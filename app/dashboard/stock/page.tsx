import StockStats from '../components/stock/StockStats';
import FilterSortBar from '../components/stock/FilterSortBar';
import ProductCard from '../components/stock/ProductCard';

const products = [
    {
        title: 'Disposable Gloves (Box)',
        category: 'Safety Equipment',
        currentStock: 6,
        maxStock: 60,
        consumption: 18,
        lastOrder: '12/10/2025',
        vendor: 'SafetyFirst',
        isCritical: true,
    },
    {
        title: 'Office Paper A4 (Box of 10)',
        category: 'Office Equipment',
        currentStock: 8,
        maxStock: 50,
        consumption: 15,
        lastOrder: '10/10/2025',
        vendor: 'OfficeMax',
        isCritical: true,
    },
    {
        title: 'Trash Bags (Heavy Duty)',
        category: 'Cleaning Supply',
        currentStock: 10,
        maxStock: 75,
        consumption: 12,
        lastOrder: '18/10/2025',
        vendor: 'CleanPro',
        isCritical: true,
    },
    {
        title: 'Hand Sanitizer (5L)',
        category: 'Cleaning Supply',
        currentStock: 12,
        maxStock: 100,
        consumption: 20,
        lastOrder: '15/10/2025',
        vendor: 'CleanPro',
        isCritical: true, // Based on screenshot having red tint/alert
    },
    {
        title: 'Cleaning Wipes (Industrial)',
        category: 'Cleaning Supply',
        currentStock: 45,
        maxStock: 80,
        consumption: 10,
        lastOrder: '20/10/2025',
        vendor: 'HygieneCo',
        isCritical: false,
    },
];

export default function StockPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Stock and Reorder</h1>
                <p className="text-slate-500">Monitor inventory levels and manage reorders efficiently</p>
            </div>

            <StockStats />

            <FilterSortBar />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                    <ProductCard key={index} {...product} />
                ))}
            </div>
        </div>
    );
}
