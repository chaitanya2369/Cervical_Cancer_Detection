export default function Blogs() {
    return (
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-teal-500 uppercase mb-4">Our Blogs</h2>
          <div className="flex items-center">
            <div className="w-1/2">
              <h3 className="text-2xl font-bold mb-4">Great Doctor Reviews</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Aliquid voluptatibus laboriosam tempore officiis quos praesentium.
              </p>
            </div>
            <div className="w-1/2 pl-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Aliquid voluptatibus laboriosam tempore officiis quos praesentium.
                </p>
                <div className="flex items-center mt-4">
                  <div className="h-10 w-10 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">Dr. K.A. Naidu</p>
                    <p className="text-gray-600">Gynecologist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }