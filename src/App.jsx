import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X, 
  ArrowRight, 
  Sparkles,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';

const ARTWORKS = [
  {
    id: 1,
    title: 'Echoes of the Delta',
    category: 'Oil on Canvas',
    year: '2025',
    dimensions: '48" x 60"',
    price: '$3,800',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    description: 'Textured impasto study capturing the interaction between morning humidity, dense foliage, and shifting coastal waterways.',
    palette: ['#1E2E28', '#A27B5C', '#DCD7C9', '#3F4E4F']
  },
  {
    id: 2,
    title: 'Harmattan Solitude',
    category: 'Mixed Media',
    year: '2026',
    dimensions: '36" x 48"',
    price: '$2,950',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    description: 'Gold leaf, earth pigments, and cold wax layered to recreate the diffused amber haze of West African dust winds.',
    palette: ['#C5A880', '#533E2D', '#E5BA73', '#1A120B']
  },
  {
    id: 3,
    title: 'Resilience in Ochre',
    category: 'Portraits',
    year: '2025',
    dimensions: '40" x 50"',
    price: 'Acquired',
    status: 'Private Collection',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80',
    description: 'Figurative exploration of ancestral dignity through expressive brushstrokes and high-contrast earthen tones.',
    palette: ['#8B4513', '#D2691E', '#F4A460', '#2C1810']
  },
  {
    id: 4,
    title: 'Architectural Monolith IV',
    category: 'Abstract',
    year: '2026',
    dimensions: '60" x 72"',
    price: '$5,200',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80',
    description: 'A study in geometric balance, raw linen exposure, and brutalist structural forms rendered in stark obsidian and gilded brass.',
    palette: ['#121212', '#C9A86A', '#ECECEC', '#4A4036']
  },
  {
    id: 5,
    title: 'Nocturne Tide',
    category: 'Oil on Canvas',
    year: '2025',
    dimensions: '30" x 40"',
    price: '$2,400',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    description: 'Deep Prussian blues and midnight blacks broken by shimmering lunar reflections across open surf.',
    palette: ['#0B132B', '#1C2541', '#3A506B', '#5BC0BE']
  },
  {
    id: 6,
    title: 'Kinetic Bronze',
    category: 'Abstract',
    year: '2026',
    dimensions: '48" x 48"',
    price: '$3,100',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1000&q=80',
    description: 'Dynamic kinetic sweeps created with palette knives, heavy medium, and burnt copper pigments.',
    palette: ['#A0522D', '#CD853F', '#D2B48C', '#3E2723']
  }
];

const CATEGORIES = ['All', 'Oil on Canvas', 'Mixed Media', 'Portraits', 'Abstract'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalArtwork, setActiveModalArtwork] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, text: '' });

  // Filter artworks dynamically
  const filteredArtworks = useMemo(() => {
    if (selectedCategory === 'All') return ARTWORKS;
    return ARTWORKS.filter(art => art.category === selectedCategory);
  }, [selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open artwork modal and bridge to inquiry form
  const handleSelectArtworkForInquiry = (art) => {
    setActiveModalArtwork(null);
    setFormData(prev => ({
      ...prev,
      subject: `Acquisition Inquiry: ${art.title} (${art.price})`,
      message: `Hello Studio, I am interested in acquiring or discussing the piece titled "${art.title}". Please share details regarding shipping and authenticity documentation.`
    }));
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit form payload to Express backend on port 4000
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: null, text: '' });

    try {
      const response = await fetch('http://localhost:4000/api/inquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server rejected the request.');
      }

      setFeedback({
        type: 'success',
        text: data.message || `Automated confirmation sent to ${formData.email}!`
      });

      // Clear the form fields upon success
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Submission error:', err);
      setFeedback({
        type: 'error',
        text: 'Unable to connect to the backend server. Make sure "node server.mjs" is running on port 4000.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E8E6E3] font-sans antialiased selection:bg-[#C9A86A] selection:text-black">
      {/* Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0D0D0D]/80 border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Palette className="w-6 h-6 text-[#C9A86A]" />
            <span className="font-serif tracking-widest text-lg font-semibold text-stone-100 uppercase">
              Vance Atelier
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase text-stone-400">
            <a href="#gallery" className="hover:text-[#C9A86A] transition-colors">Catalog</a>
            <a href="#about" className="hover:text-[#C9A86A] transition-colors">Philosophy</a>
            <a href="#contact" className="hover:text-[#C9A86A] transition-colors">Inquiries</a>
          </nav>
          <a
            href="#contact"
            className="px-4 py-2 border border-[#C9A86A]/60 text-[#C9A86A] text-xs uppercase tracking-widest hover:bg-[#C9A86A] hover:text-black transition-all"
          >
            Commission Work
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-28 px-6 border-b border-stone-900 bg-gradient-to-b from-[#141414] to-[#0D0D0D]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-stone-800 bg-stone-900/60 text-[#C9A86A] text-xs tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contemporary Fine Art & Visual Studies</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif tracking-tight text-stone-100 font-light leading-tight">
            Capturing the raw tension between natural earth pigments and light.
          </h1>
          <p className="text-stone-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Original works by Elena Vance. Exploring West African coastal environments, architectural form, 
            and abstract pigment layering.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-stone-800 pb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 font-light">Selected Works</h2>
            <p className="text-stone-400 text-sm mt-1">Browse active studio inventory and permanent acquisitions.</p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase transition-all rounded-sm border ${
                  selectedCategory === category
                    ? 'border-[#C9A86A] bg-[#C9A86A] text-black font-semibold'
                    : 'border-stone-800 text-stone-400 hover:border-stone-600 hover:text-stone-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map(art => (
            <article 
              key={art.id} 
              className="group bg-[#141414] border border-stone-800/80 overflow-hidden flex flex-col justify-between hover:border-stone-700 transition-all"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-900 cursor-pointer" onClick={() => setActiveModalArtwork(art)}>
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[11px] uppercase tracking-wider text-stone-300 border border-stone-700">
                  {art.category}
                </div>
                {art.status !== 'Available' && (
                  <div className="absolute top-4 right-4 bg-red-950/80 border border-red-800/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-red-200">
                    {art.status}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-serif text-stone-100 group-hover:text-[#C9A86A] transition-colors">
                      {art.title}
                    </h3>
                    <span className="text-xs text-stone-500 font-mono">{art.year}</span>
                  </div>
                  <p className="text-xs text-stone-400">{art.dimensions}</p>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-sm font-serif text-[#C9A86A] font-semibold">{art.price}</span>
                  <button
                    onClick={() => setActiveModalArtwork(art)}
                    className="text-xs uppercase tracking-wider text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Examine <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lightbox / Artwork Detail Modal */}
      {activeModalArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#121212] border border-stone-800 max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setActiveModalArtwork(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-[4/5] bg-stone-900 overflow-hidden border border-stone-800">
                <img
                  src={activeModalArtwork.image}
                  alt={activeModalArtwork.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#C9A86A]">{activeModalArtwork.category}</span>
                <h3 className="text-2xl font-serif text-stone-100">{activeModalArtwork.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{activeModalArtwork.description}</p>
                
                <div className="space-y-1.5 text-xs text-stone-300 font-mono">
                  <p><span className="text-stone-500">Dimensions:</span> {activeModalArtwork.dimensions}</p>
                  <p><span className="text-stone-500">Completed:</span> {activeModalArtwork.year}</p>
                  <p><span className="text-stone-500">Valuation:</span> {activeModalArtwork.price}</p>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-stone-500 mb-2 uppercase tracking-wider">Pigment Swatches</p>
                  <div className="flex gap-2">
                    {activeModalArtwork.palette.map((hex, idx) => (
                      <span
                        key={idx}
                        className="w-6 h-6 rounded-full border border-stone-700 shadow-inner"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleSelectArtworkForInquiry(activeModalArtwork)}
                    className="w-full py-3 bg-[#C9A86A] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#d6b77c] transition-colors"
                  >
                    Inquire About This Piece
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form Section */}
      <section id="contact" className="py-20 px-6 border-t border-stone-800 bg-[#111111]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-serif text-stone-100 font-light">Studio & Commission Inquiries</h2>
            <p className="text-stone-400 text-sm">
              Submissions are delivered directly to the studio's Node.js backend.
            </p>
          </div>

          {/* Feedback Messages */}
          {feedback.text && (
            <div className={`p-4 mb-8 border flex items-start space-x-3 text-sm rounded ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{feedback.text}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmitInquiry} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-stone-400">Your Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Marcus Sterling"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#181818] border border-stone-800 p-3.5 text-stone-200 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors rounded"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-stone-400">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g., client@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#181818] border border-stone-800 p-3.5 text-stone-200 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-400">Subject / Artwork Title</label>
              <input
                type="text"
                name="subject"
                placeholder="e.g., Acquisition Inquiry: Echoes of the Delta"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full bg-[#181818] border border-stone-800 p-3.5 text-stone-200 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-400">Message / Commission Specs</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Describe your space, timeline, or inquiries regarding provenance and shipping..."
                value={formData.message}
                onChange={handleInputChange}
                className="w-full bg-[#181818] border border-stone-800 p-3.5 text-stone-200 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors rounded resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#C9A86A] text-black font-semibold text-xs tracking-widest uppercase hover:bg-[#d4b576] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed rounded cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting to Studio Server...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Studio Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-stone-900 bg-[#0A0A0A] text-center text-xs text-stone-500 space-y-2">
        <p className="tracking-widest uppercase">Elena Vance Contemporary Atelier &copy; 2026</p>
        <p>Built with React, Tailwind CSS, and Node.js</p>
      </footer>
    </div>
  );
}