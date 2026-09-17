# @aether/data-services

Data access services and swappable API adapters for the Aether dashboard.

`ApiClient` is the boundary used by domain services. The default provider uses
`MockApiAdapter`; an HTTP implementation can be registered for `API_CLIENT`
without changing `ProbesService`.
