export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* CARDS */}

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
        "
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="
                  bg-white
                  rounded-2xl
                  shadow-md
                  p-5
                  h-32
                "
          >
            <div
              className="
                    h-4
                    bg-gray-200
                    rounded
                    mb-4
                    w-1/2
                  "
            />

            <div
              className="
                    h-8
                    bg-gray-200
                    rounded
                    w-3/4
                  "
            />
          </div>
        ))}
      </div>

      {/* TABELAS */}

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
              "
        >
          <div
            className="
                  h-5
                  bg-gray-200
                  rounded
                  w-1/3
                  mb-6
                "
          />

          {Array.from({ length: 5 }).map((__, row) => (
            <div
              key={row}
              className="
                        flex
                        justify-between
                        mb-4
                      "
            >
              <div
                className="
                          h-4
                          bg-gray-200
                          rounded
                          w-1/3
                        "
              />

              <div
                className="
                          h-4
                          bg-gray-200
                          rounded
                          w-12
                        "
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
