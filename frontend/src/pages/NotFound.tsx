import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, MapPin, Search, Wrench, Car } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />

      {/* Dynamic light spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <AnimatedSection className="w-full">
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">

          {/* Main 404 Visual */}
          <div className="relative mb-8 group">
            {/* 404 Text */}
            <h1 className="text-[180px] md:text-[280px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none z-0">
              404
            </h1>

            {/* Floating Car / Element Over 404 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gold blur-2xl opacity-20 animate-pulse"></div>
                <Car className="w-32 h-32 md:w-48 md:h-48 text-gold relative z-10 drop-shadow-2xl fill-black/50" strokeWidth={1.5} />

                {/* "Lost" Icon badge */}
                <div className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                  <MapPin className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>

            {/* Road lines underneath */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[300px] h-[4px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)]"></div>
          </div>

          <div className="text-center space-y-6 max-w-2xl mx-auto -mt-10 md:-mt-20 relative z-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Off Road? <span className="text-gold">Navigation Lost.</span>
            </h2>

            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              We did a full diagnostic, but the page you're looking for seems to be missing from our fleet. It might have been sold, moved, or never existed in the first place.
            </p>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mx-auto bg-white/5 p-2 rounded-2xl border border-white/10 mt-8 backdrop-blur-sm">
              <Link to="/our-fleet" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition-all group text-left">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-gold transition-colors">Browse Fleet</div>
                  <div className="text-xs text-gray-400">Find your perfect ride</div>
                </div>
              </Link>

              <Link to="/contact" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition-all group text-left">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-blue-400 transition-colors">Report Issue</div>
                  <div className="text-xs text-gray-400">Let us know what happened</div>
                </div>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/">
                <Button size="lg" className="h-14 px-10 font-bold text-base gap-2 bg-gold hover:bg-gold/90 text-black border-none shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all duration-300 rounded-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <Home className="w-5 h-5" />
                  Return to Garage
                </Button>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors h-14 px-8 font-medium rounded-xl hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>

            <div className="pt-12 pb-4 text-sm text-gray-600">
              Error Code: <strong>404_VEHICLE_NOT_FOUND</strong>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default NotFound;
