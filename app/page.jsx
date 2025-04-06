import HeroSection from "@/components/ui/hero";
import { Button } from "@/components/ui/ui/button";
import { Card, CardContent } from "@/components/ui/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="mt-40">
      <HeroSection></HeroSection>
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((statsData,index)=>(
             <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{statsData.value}</div>
              <div className="text-gray-600">{statsData.label}</div>
             </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Smart Ways to Save & Grow Your Money
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature,index)=>(
              <Card key={index} className="p-6">
              <CardContent className="space-y-4 pt-4">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>         
            </Card>
            
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 animate-shine">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((step,index)=>(
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
            
            ))}
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
           What Our User Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial,index)=>(
              <Card key={index} className="p-6">
              <CardContent className="pt-4">
               <div className="flex mb-6">
               <div className="ml-3">
                  <Image src={testimonial.image} alt={testimonial.name} width={40} height={40} className="rounded-full"></Image>
                </div>
                <div className="ml-4 ">
                        <div className="font-semibold "> {testimonial.name} </div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>

               </div>
                <p className="text-gray-600">{testimonial.quote}</p>
              </CardContent>         
            </Card>
            
            ))}
          </div>
        </div>
      </section>

            
      <section className="py-20 bg-blue-600">
 
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Ready To Take Control Of Your Finances ?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances smarter with <span className=" font-bold text-xl">Fin<span className="text-red-600 italic">X</span> pert</span>
          </p>
            <Link href="/dashboard">
            
            <div className="flex justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-200 animate-bounce cursor-pointer">
                Start Free Trial 
              </Button>
            </div>
            
            </Link>
        </div>
      </section>


    </div>
  );
    
}
