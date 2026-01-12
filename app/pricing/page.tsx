import Pricing from '../components/Pricing';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Pricing />
            </main>
            <Footer />
        </div>
    );
}
