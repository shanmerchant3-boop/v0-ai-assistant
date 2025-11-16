import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Shield, Zap, Clock, Award, Users, ShoppingBag, Star, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import ValorantVideoBackground from "./valorant-video-background"

const Hero = ({ scrollToProducts }) => {
  return (
    <section className="relative min-h-[120vh] lg:min-h-[130vh] flex flex-col items-center justify-center overflow-hidden pt-40 pb-24">
      <ValorantVideoBackground />
      
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Top Stats Badges */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="glass px-5 py-2.5 border-primary/40 shadow-glow hover:shadow-[0_0_40px_rgba(147,51,234,0.7),0_0_80px_rgba(147,51,234,0.4)] hover:scale-105 transition-all duration-300">
            <Shield className="w-4 h-4 mr-2 text-primary" />
            <span className="font-semibold">Trusted by 1,500+ Users</span>
          </Badge>
          <Badge className="glass px-5 py-2.5 border-primary/40 shadow-glow hover:shadow-[0_0_40px_rgba(147,51,234,0.7),0_0_80px_rgba(147,51,234,0.4)] hover:scale-105 transition-all duration-300">
            <Users className="w-4 h-4 mr-2 text-primary" />
            <span className="font-semibold">350 Online Now</span>
          </Badge>
          <Badge className="glass px-5 py-2.5 border-primary/40 shadow-glow hover:shadow-[0_0_40px_rgba(147,51,234,0.7),0_0_80px_rgba(147,51,234,0.4)] hover:scale-105 transition-all duration-300">
            <Award className="w-4 h-4 mr-2 text-primary" />
            <span className="font-semibold">100% Secure</span>
          </Badge>
        </motion.div>
        
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Added pill badge subtitle above main heading */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Premium Valorant Services
            </span>
          </motion.div>
          
          {/* Increased text sizes and line height for better readability */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                Zaliant Services!
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary-glow/20 to-primary/20 blur-xl opacity-50 animate-glow-pulse" />
            </span>
          </motion.h1>
 
          {/* Increased text size and added more vertical spacing */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Premium products crafted to enhance your gameplay and dominate your opponents
            with ease.
          </motion.p>
          
          {/* Feature Cards with Glassmorphism */}
          {/* Increased top margin for more breathing room */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="glass-card p-8 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <div className="relative">
                <Shield className="w-12 h-12 text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">Undetected</h3>
              <p className="text-sm text-muted-foreground">Advanced protection keeps you safe</p>
            </div>
            
            <div className="glass-card p-8 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <div className="relative">
                <Zap className="w-12 h-12 text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">Instant Delivery</h3>
              <p className="text-sm text-muted-foreground">Get access immediately after purchase</p>
            </div>
            
            <div className="glass-card p-8 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <div className="relative">
                <Clock className="w-12 h-12 text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Our team is always here to help</p>
            </div>
          </motion.div>
          
          {/* Increased top margin for button spacing */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button 
              onClick={scrollToProducts}
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6 h-auto group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Store
                <ShoppingBag className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button 
              onClick={() => window.open('https://status.zaliantservices.com', '_blank')}
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 h-auto border-primary/50 hover:bg-primary/20 hover:shadow-[0_0_25px_rgba(147,51,234,0.5),0_0_50px_rgba(147,51,234,0.3)] group"
            >
              <span className="flex items-center gap-2">
                Check Status
                <TrendingUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
              </span>
            </Button>
          </motion.div>
          
          {/* Increased top margin for stats section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground font-medium mb-3">Uptime</div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted/20">
                <div className="h-full bg-gradient-to-r from-primary via-primary-glow to-accent" style={{ width: '99%' }}></div>
              </div>
            </div>
            
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">3,491</div>
              <div className="text-sm text-muted-foreground font-medium mb-3">Products Sold</div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted/20">
                <div className="h-full bg-gradient-to-r from-primary via-primary-glow to-accent" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <Star className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">4.98</div>
              <div className="text-sm text-muted-foreground font-medium mb-3">Avg Rating</div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted/20">
                <div className="h-full bg-gradient-to-r from-primary via-primary-glow to-accent" style={{ width: '98%' }}></div>
              </div>
            </div>
            
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm text-muted-foreground font-medium mb-3">Support</div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted/20">
                <div className="h-full bg-gradient-to-r from-primary via-primary-glow to-accent" style={{ width: '100%' }}></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
