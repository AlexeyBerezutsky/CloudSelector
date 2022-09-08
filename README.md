# Cloud Selector

A simple tool for cloud server selection.  
It uses your geolocation and data from [Aiven Cloud API](https://api.aiven.io/doc/#tag/Cloud)

# Quick Start

## Development
```sh
npm ci && npm run start 
```
## Produciton
```sh
npm ci && npm run build 
```
Production code will be in /build folder
## Test
```sh
npm ci && npm run test 
```
# Nearest cloud 

You could observe a bunch of Providers, Regions and list of clouds.

Left provider has a closest region to you.

Left region has closest server. 

Top cloud is nearest to you. 

This tool is able to calculate nearest cloud provider by two methods. Depending on what you need, please choose one:

- if you need to switch between clouds in the region, use **Center**
- if you need a region with the nearest cloud server, then use **Nearest** 

The tool requires your geolocation, but if you do not want to share it, you will be able to select the nearest region which fits to you. 

### NB
You could emulate different locations by using the sensor menu ( Chrome => f12 => more tools => sensors)

# What is an idea behind?

There are two entities: 
one has dimensions: provider name x regionName and keeps data for bunch of cloud servers. 
The second has the same dimensions (name x regionName), but keeps distances from regions to your position.

First one is needed for fast access to clouds which are related to some region and provider.
Second keeps orders of regions, providers and distance.

If a pair of provider name and region name is selected, then the appropriate list of clouds will be sorted. 

# Issues

During installation, you could see vulnerabilities report. 
Check [this article for](https://overreacted.io/npm-audit-broken-by-design/) details.

TL;DR: use
```sh
npm audit --production
```

# What's left?

## Geolocation fallback

If the user does not give us information about his position we have 3 options:

- Ask user to allow geolocation and explain why it's so critical to have it.

- Give the user some list of places which are could fit. 

**BTW** There is possible case where the user does not need selection based on his geolocation. For instance, he is remote working. he is in Finland and select infrastructure for Tokyo office.   

- grab data from CDN 
Aiven console is using Cloudfare and cdnjs. At least Cloudfire could provide you with geolocation data [like here](https://www.cloudflare.com/cdn-cgi/trace). 
On a first call from user we could get location information on cdn side, then create some approximation of the location.

# Credits

All thoughts about geolocation service were based on Paul Kinlan [article](https://web.dev/native-hardware-user-location/).