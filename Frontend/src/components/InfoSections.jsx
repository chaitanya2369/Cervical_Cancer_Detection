const InfoSections = () => {
    const infoData = [
      {
        title: 'Discover Our Process',
        subtitle: 'Transforming Detection with Technology',
        description: 'Our innovative application integrates advanced imaging and AI technology to streamline cervical cancer detection. From image capture to diagnosis, our solution ensures speed, accuracy, and ease of use for medical professionals.',
      },
      {
        title: 'Discover Our Process',
        subtitle: 'Transforming Detection with Technology',
        description: 'Our innovative application integrates advanced imaging and AI technology to streamline cervical cancer detection. From image capture to diagnosis, our solution ensures speed, accuracy, and ease of use for medical professionals.',
      },
      {
        title: 'Discover Our Process',
        subtitle: 'Transforming Detection with Technology',
        description: 'Our innovative application integrates advanced imaging and AI technology to streamline cervical cancer detection. From image capture to diagnosis, our solution ensures speed, accuracy, and ease of use for medical professionals.Empowering healthcare professionals through AI-powered detection systems for earlier and more effective treatment plans.',
      },
    ];
  
    return (
        <section
          className="relative bg-cover bg-center p-16 h-screen flex flex-col items-center"
          style={{ backgroundImage: 'url(/images/infosectionbg.jpg)' }}
        >
          <div className="flex flex-col md:flex-row justify-center gap-16 relative z-10 py-32 box ">
            {infoData.map((info, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 p-6 shadow-lg rounded-lg w-full md:w-1/3 flex flex-col items-start transition-transform transform hover:scale-105 shadow-2xl"
              >
                <h1 className="text-xl font-bold mb-4">{info.title}</h1>
                <h3 className="text-xl font-medium mb-4">{info.subtitle}</h3>
                <p className="text-gray-600 mb-6">{info.description}</p>
                <button className="text-teal-600 hover:underline font-semibold">
                  READ MORE ►
                </button>
              </div>
            ))}
          </div>
        </section>
      );    
  };
  
  export default InfoSections;