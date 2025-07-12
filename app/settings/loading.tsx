export default function SettingsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>

          <div className="border rounded-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-8 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-8 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
