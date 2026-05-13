export default function Home() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">System Dashboard</h1>
      <p className="text-gray-500 mb-12 max-w-2xl text-[15px]">
        Welcome to your standalone Admin UI for the Dinorah LLP platform. You can fully parameterize your Categories, Lookbook Designs, and standard Galleries here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Categories Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Categories</h3>
          <p className="text-sm text-gray-500 font-medium">Manage categorization options for garments and galleries.</p>
        </div>

        {/* Designs Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Featured Designs</h3>
          <p className="text-sm text-gray-500 font-medium">Upload portfolio pieces directly to Cloudinary.</p>
        </div>

        {/* Gallery Card */}
       /* <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.53 3.19L17 11l4 5H10l1-2zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Image Gallery</h3>
          <p className="text-sm text-gray-500 font-medium">Coordinate dynamic legacy photos globally.</p>
        </div>
      </div>
    </div>
  );
}
