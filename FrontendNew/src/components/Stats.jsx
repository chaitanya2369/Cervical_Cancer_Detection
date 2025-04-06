export default function Stats() {
    return (
      <section className="text-white py-12" style={{backgroundColor:"#243956"}}>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold">125+</h3>
            <p>Doctors Using</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">2K+</h3>
            <p>Treated Patients</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">5K+</h3>
            <p>Predictions Made</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">4.7K+</h3>
            <p>Successful Predictions</p>
          </div>
        </div>
      </section>
    );
  }