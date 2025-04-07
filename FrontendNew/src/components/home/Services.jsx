export default function Services() {
    const services = [
      { title: "Gynecology", desc: "Comprehensive care for women's health, including routine exams, prenatal care, and treatment of gynecological conditions", path:"/images/gynecology.png" },
      { title: "Cardiology", desc: "Expert heart care services, including diagnosis, treatment, and management of cardiovascular diseases",path:"/images/cardiology.png" },
      { title: "Urology", desc: "Specialized care for urinary tract and male reproductive system disorders, including surgeries and therapies.",path:"/images/urology.png" },
      { title: "Neurology", desc: "Advanced treatment for nervous system conditions, including brain, spinal cord, and nerve disorders.",path:"/images/neurology.png" },
      { title: "Radiology", desc: "State-of-the-art imaging services, such as X-rays, MRIs, and CT scans, for accurate diagnosis.",path:"/images/radiology.png" },
      { title: "Pulmonology", desc: "Dedicated care for lung and respiratory conditions, including asthma, COPD, and lung disease management",path:"/images/pulmonology.png" },
    ];
  
    return (
      <section className="py-16 bg-gray-100 px-12">
        <h2 className="font-bold text-center text-xl text-teal-600">MEDICAL SERVICES</h2>
        <div className="container mx-auto text-center m-6">
          <h2 className="text-3xl font-bold mb-8">Find Out More About Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow">
                <div className="h-16 w-16 mx-auto rounded-full mb-4">
                  <img src={service.path} alt="err" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }