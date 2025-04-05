export default function Services() {
    const services = [
      { title: "Gynecology", desc: "Lorem ipsum dolor sit amet consectetur adipiscing." },
      { title: "Cardiology", desc: "Lorem ipsum dolor sit amet consectetur adipiscing." },
      { title: "Urology", desc: "Lorem ipsum dolor sit amet consectetur adipiscing." },
      { title: "Neurology", desc: "Lorem ipsum dolor sit amet consectetur adipiscing." },
      { title: "Radiology", desc: "Lorem ipsum dolor sit amet consectetur adipiscing." },
      { title: "Pulmonology", desc: "Lorem ipsum dolor sit amet consectetur adipiscing." },
    ];
  
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Find Out More About Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow">
                <div className="h-16 w-16 mx-auto bg-gray-300 rounded-full mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }