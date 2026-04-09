# Operator GPU/Accelerator Deployment Research
## Date: 2026-04-05

Format: Operator | GPU Type | Facilities/Regions | Source URL

---

## 1. Equinix

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA DGX GB300 (72x Blackwell Ultra GPUs, liquid-cooled) | 45 markets worldwide (NVIDIA Instant AI Factory managed service) | [Equinix Blog - GTC Mar 2026](https://blog.equinix.com/blog/2026/03/12/equinix-at-nvidia-gtc-looking-back-on-a-year-of-ai-acceleration/) |
| NVIDIA DGX B300 (air-cooled, B300 NVL16) | 45 markets worldwide (NVIDIA Instant AI Factory managed service) | [Equinix Blog - GTC Mar 2026](https://blog.equinix.com/blog/2026/03/12/equinix-at-nvidia-gtc-looking-back-on-a-year-of-ai-acceleration/) |

**Notes:** Equinix is primarily a colocation provider -- they host GPU cloud tenants (CoreWeave, Lambda, etc.) rather than owning GPUs. The NVIDIA Instant AI Factory is a first-party managed service Equinix will offer with pre-configured DGX GB300 and DGX B300 systems in their IBX facilities. Equinix is the first provider for this service. 60% of largest deals in Q4 2025 were AI workload-driven. 280 data centers in 76 markets.

---

## 2. Digital Realty / Interxion

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA Vera Rubin NVL72 (planned, AI Factory Research Center) | Manassas, Virginia -- "Aurora" 96MW AI Factory (H1 2026 completion) | [Digital Realty IR Nov 2025](https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-advances-ai-infrastructure-innovation-supporting), [DCD](https://www.datacenterdynamics.com/en/news/nvidia-to-deploy-emerald-ais-orchestration-software-at-96mw-aurora-data-center-in-manassas-virginia/) |
| NVIDIA + OQC GENESIS quantum-GPU (CUDA-Q platform) | Innovation Lab (location not specified) | [Digital Realty Newsroom](https://www.digitalrealty.com/about/newsroom/press-releases/123343/digital-realty-launches-innovation-lab-to-accelerate-ai-and-hybrid-cloud-implementation) |

**Notes:** Digital Realty is colocation/wholesale. The Aurora AI Factory at Manassas is NVIDIA's own research center being built by Digital Realty -- it will use NVIDIA Vera Rubin platform and the DSX Flex reference design. This is NVIDIA's facility, not Digital Realty deploying its own GPUs. Interxion (EU arm) hosts NVIDIA-powered tenants but specific GPU models at Interxion sites could not be verified from available sources. Digital Realty is also a certified NVIDIA DGX-Ready Data Center partner.

---

## 3. STACK Infrastructure

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|

**I could not verify any specific GPU deployments attributed to STACK Infrastructure from available sources.** Multiple searches returned no STACK-specific GPU/accelerator announcements. STACK is a colocation provider focused on hyperscale; they likely host tenants with GPUs, but no public announcements name specific GPU hardware at STACK facilities.

---

## 4. Cologix

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA HGX B200 (Blackwell, via Lambda 1-Click Clusters) | Columbus, Ohio -- COL4 Scalelogix | [Cologix Press Release Jun 2025](https://cologix.com/news/cologix-and-lambda-launch-first-nvidia-hgx-b200-accelerated-ai-clusters-in-columbus-at-col4/) |
| NVIDIA GPUs (4,000 GPUs deployed via Lambda in <90 days) | Columbus, Ohio -- COL4 | [Cologix Press Release Jun 2025](https://cologix.com/news/cologix-and-lambda-launch-first-nvidia-hgx-b200-accelerated-ai-clusters-in-columbus-at-col4/) |
| NVIDIA GPUs (GPUaaS via Consensus Core, model unspecified) | Montreal -- MTL10 | [Cologix Blog](https://cologix.com/resources/blogs/the-rise-of-gpuaas-powering-scalable-ai-with-modern-data-centers/) |

**Notes:** Cologix hosts Lambda's GPU infrastructure, not its own GPUs. COL4 Scalelogix is a confirmed NVIDIA Blackwell B200 site. Montreal MTL10 has NVIDIA GPUaaS via Consensus Core but specific model unconfirmed. MTL8 (21MW, LEED Gold) coming online 2025 with Hydro-Quebec renewable power.

---

## 5. CoreWeave

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA H100 | Multiple US sites | [NVIDIA Blog](https://blogs.nvidia.com/blog/h100-coreweave-graph500/) |
| NVIDIA H200 (Hopper) | UK -- Crawley (Digital Realty partner, Oct 2024) and London Docklands (Global Switch, Dec 2024); Barcelona, Spain (10,224 H200s, Merlin Edged) | [CoreWeave PR Jan 2025](https://www.prnewswire.com/news-releases/coreweave-announces-two-initial-data-centers-hosting-nvidia-hopper-gpus-now-operational-in-the-united-kingdom-accelerating-ai-infrastructure-302348885.html), [Dgtl Infra](https://dgtlinfra.com/coreweave-data-center-locations/) |
| NVIDIA GB200 NVL72 (Blackwell) | Multiple US sites -- first commercial deployment Feb 2025 | [CoreWeave Blog](https://www.coreweave.com/blog/our-capacity-plans-for-coreweave-data-centers), [NVIDIA Blog](https://blogs.nvidia.com/blog/coreweave-grace-blackwell-gb200-nvl72/) |
| NVIDIA GB300 NVL72 (Blackwell Ultra) | Switch facility (first commercial deployment Jul 2025) | [CoreWeave PR](https://www.coreweave.com/news/coreweave-advances-ai-native-cloud-platform-for-the-next-phase-of-production-scale-ai), [Data Center Frontier](https://www.datacenterfrontier.com/machine-learning/article/55305429/ai-at-scale-switch-hosts-coreweaves-landmark-nvidia-gb300-deployment) |
| NVIDIA HGX B300 | Announced | [CoreWeave PR](https://www.coreweave.com/news/coreweave-advances-ai-native-cloud-platform-for-the-next-phase-of-production-scale-ai) |
| NVIDIA BlueField-3 DPU | Deployed across fleet for multi-tenant isolation | [NVIDIA Case Study](https://www.nvidia.com/en-us/case-studies/core-weave-revolutionizes-data-centers-with-blufield-dpus/) |
| NVIDIA Vera Rubin (planned) | Expected H2 2026 | [CoreWeave PR](https://www.coreweave.com/news/coreweave-advances-ai-native-cloud-platform-for-the-next-phase-of-production-scale-ai) |

**Notes:** CoreWeave is a GPU cloud provider (not colocation). 32 data centers, ~250,000 GPUs as of 2025. $2B NVIDIA investment Jan 2026. First to deploy GB200 NVL72 and GB300 NVL72 commercially. US sites include: Weehawken NJ, Chicago IL, Las Vegas NV, Plano TX (at Flexential), Austin TX, Chester VA, Hillsboro OR (at Flexential), Douglasville GA (at Flexential), Lancaster PA, Muskogee OK. EU expansion: Sweden (EcoDataCenter), Norway (Kristiansand), Spain (Barcelona).

---

## 6. DataBank

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA DGX systems (NVIDIA Blackwell, Grace, BlueField -- DGX-Ready certified) | 6 certified DCs: Atlanta, Denver, Dallas, New York, Minneapolis | [DataBank Press Release](https://www.databank.com/resources/press-releases/databank-achieves-nvidia-dgx-ready-data-center-program-certification/) |

**Notes:** DataBank is NVIDIA DGX-Ready certified (supporting Blackwell architecture), meaning these facilities meet NVIDIA's standards for liquid cooling and power delivery to host DGX systems. This is a certification for hosting customer-owned DGX systems, not DataBank deploying its own GPUs. 65+ data centers in 25+ markets. Hosts HPC for Georgia Tech, University of Maryland, NJIT.

---

## 7. TierPoint

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|

**I could not verify specific GPU models deployed at TierPoint from available sources.** A DCD case study references TierPoint deploying "significant GPUs" for AI/HPC workloads using DDC cabinet technology at an ultra-high-density facility, but the specific GPU model (H100, B200, etc.) is behind a paywall/whitepaper and not disclosed in public search results. TierPoint operates three HPC centers in the US.

Source (gated): [DCD Whitepaper](https://www.datacenterdynamics.com/en/whitepapers/tierpoint-case-study-deploying-significant-gpus-for-ai-workloads/)

---

## 8. Flexential

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA H200 (via DigitalOcean tenant) | Atlanta-Douglasville 1, Georgia | [Flexential PR Mar 2025](https://www.flexential.com/resources/press-release/flexential-support-digitaloceans-gpu-infrastructure-expansion-high-density), [DigitalOcean Blog](https://www.digitalocean.com/blog/introducing-new-atlanta-data-center) |
| AMD Instinct MI300X (via DigitalOcean tenant) | Atlanta-Douglasville 1, Georgia | [DigitalOcean Blog](https://www.digitalocean.com/blog/now-available-amd-instinct-mi300x-gpus), [DCD](https://www.datacenterdynamics.com/en/news/digitalocean-to-deploy-gpus-at-flexential-data-center-in-atlanta/) |
| CoreWeave GPUs (NVIDIA, models unspecified at this site) | Plano, Texas -- 13MW deployment (Apr-Sep 2025) | [Flexential PR Apr 2025](https://www.flexential.com/resources/press-release/flexential-support-coreweaves-ai-cloud-expansion-13-mw-high-density) |
| CoreWeave GPUs (NVIDIA, models unspecified at these sites) | Hillsboro, Oregon; Douglasville, Georgia (9MW each, from late 2023) | [DCF](https://www.datacenterfrontier.com/colocation/article/55291596/inside-the-flexential-coreweave-alliance-scaling-ai-infrastructure-with-high-density-data-centers) |

**Notes:** Flexential is colocation -- it hosts tenants (DigitalOcean, CoreWeave) who bring their own GPU hardware. The DigitalOcean deployment at Atlanta-Douglasville 1 has 300+ GPUs confirmed including NVIDIA H200 and AMD Instinct MI300X across two data halls. Flexential supports 80+ kW per cabinet with liquid cooling. DigitalOcean also added AMD MI350X GPUs for inference.

---

## 9. CyrusOne

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA DGX systems (DGX-Ready certified) | North American markets (specific facilities not disclosed) | [BusinessWire May 2020](https://www.businesswire.com/news/home/20200514005160/en/CyrusOne-Enables-Customers-to-Scale-AI-Through-the-Power-of-NVIDIA-DGX-Ready-Data-Center-Program) |

**Notes:** CyrusOne is NVIDIA DGX-Ready certified (since 2020). Their Intelliscale platform supports up to 300 kW/rack for AI workloads including GPUs and TPUs, but CyrusOne does not disclose specific GPU models deployed by their tenants. Intelliscale facilities occupy 25% of the space of traditional DCs. CyrusOne operates in the US and EU. Specific GPU hardware at CyrusOne facilities could not be verified from public sources.

---

## 10. Vantage Data Centers

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|

**I could not verify specific GPU models deployed at Vantage facilities from available sources.** Vantage is a hyperscale colocation builder. Key AI-targeted campuses:
- "Frontier" mega-campus: 1,200 acres, 1.4GW, 10 DCs, Shackelford County TX, 250+ kW/rack, liquid cooling, first building H2 2026 -- [$25B investment](https://www.rcrwireless.com/20250820/ai-infrastructure/vantage-ai-texas)
- NV1 campus: Storey County NV (near Reno), $3B, 360-720W/sqft density, Q2 2026 first building -- [Vantage PR](https://vantage-dc.com/news/vantage-data-centers-invests-3-billion-to-deliver-ai-campus-in-growing-nevada-market/)

These are built for AI/GPU workloads but Vantage does not disclose tenant GPU hardware.

---

## 11. QTS Data Centers

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA DGX systems (DGX-Ready certified, integrated into SDP platform) | 24 data centers, 7M+ sqft, 900+ MW (specific certified sites not disclosed) | [QTS Newsroom](https://q.com/news/qts-certified-for-nvidia-dgx-colocation-program/) |

**Notes:** QTS is NVIDIA DGX-Ready certified and integrates DGX compute into its Service Delivery Platform (SDP). However, QTS is colocation -- customers deploy their own DGX systems. Specific GPU models at QTS facilities could not be verified from public sources. QTS provides access to NVIDIA DGX AI compute infrastructure but does not publicly disclose which GPU generations are at which sites.

---

## 12. Hut 8

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA H100 (1,000 GPUs, HPE Cray supercomputers) | Chicago, Illinois -- Tier-3 data center (Highrise AI / GPUaaS) | [Hut 8 PR Sep 2024](https://www.globenewswire.com/news-release/2024/09/26/2953642/0/en/Hut-8-GPU-as-a-Service-Vertical-Goes-Live-with-Inaugural-Deployment.html), [The Block](https://www.theblock.co/post/318347/bitcoin-miner-hut-8-expands-ai-push-with-new-gpu-as-a-service-cluster) |

**Upcoming (GPU model not yet disclosed):**
- Anthropic/Fluidstack partnership: 245MW initial (up to 2.295GW), River Bend campus, Louisiana. $7B 15-year lease. Initial data hall Q2 2027. GPU type for this deployment not specified. [Hut 8 PR Dec 2025](https://www.hut8.com/news-insights/press-releases/hut-8-announces-ai-infrastructure-partnership-with-anthropic-and-fluidstack)

**Notes:** Hut 8 pivoted from Bitcoin mining to AI infrastructure. The 1,000x H100 GPUaaS cluster in Chicago is confirmed and operational under the Highrise AI brand with a 5-year agreement. The Anthropic deal is a data center lease -- Hut 8 provides power/space, Fluidstack operates clusters, Anthropic is the end customer. Google financially backstops the lease.

---

## 13. OVHcloud

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA H100 (SXM and PCIe) | Global -- 37 data centers across 4 continents (specific GPU locations not disclosed per-site) | [OVHcloud Newsroom](https://corporate.ovhcloud.com/en/newsroom/news/adds-cutting-edge-gpus/) |
| NVIDIA H200 NVL (up to 4x with NVLink, 141GB HBM3e) | Global (early access) | [OVHcloud Labs](https://labs.ovhcloud.com/en/gpus-early-access/), [OVHcloud H200 page](https://www.ovhcloud.com/en/public-cloud/gpu/h200/) |
| NVIDIA L40S (48GB, Ada Lovelace) | Global | [OVHcloud Newsroom](https://corporate.ovhcloud.com/en/newsroom/news/adds-cutting-edge-gpus/) |
| NVIDIA L4 (24GB, Ada Lovelace) | Global | [OVHcloud Newsroom](https://corporate.ovhcloud.com/en/newsroom/news/adds-cutting-edge-gpus/) |
| NVIDIA A100 (80GB) | Global | [OVHcloud Newsroom](https://corporate.ovhcloud.com/en/newsroom/news/adds-cutting-edge-gpus/) |
| NVIDIA B200 HGX (8x GPUs with NVSwitch, 1,440GB total, early access) | Global (early access) | [OVHcloud Labs](https://labs.ovhcloud.com/en/gpus-early-access/) |
| AMD Instinct MI325X (8x PCIe, 256GB HBM3e, early access) | Global (early access) | [OVHcloud Labs](https://labs.ovhcloud.com/en/gpus-early-access/) |
| NVIDIA V100, V100S (legacy) | Global | [OVHcloud Newsroom](https://corporate.ovhcloud.com/en/newsroom/news/adds-cutting-edge-gpus/) |

**Notes:** OVHcloud is a cloud provider that owns and deploys GPUs (not colocation). Major data center locations: Gravelines (France), Roubaix (France), Strasbourg (France), Beauharnois (Quebec, Canada), Frankfurt (Germany), and others. OVHcloud does not publicly disclose which GPU models are at which specific data center. B200 HGX and AMD MI325X are in early access via Labs program. OVHcloud operates 450,000+ servers.

---

## 14. AirTrunk

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA DGX systems (DGX-Ready colocation partner) | APAC campuses: Australia, Hong Kong, Japan, Malaysia, Singapore | [AirTrunk Press Release Aug 2024](https://airtrunk.com/airtrunk-appointed-dgx-ready-colocation-partner-of-nvidia/), [Data Centre Magazine](https://datacentremagazine.com/data-centres/airtrunk-becomes-dgx-ready-colocation-partner-of-nvidia) |

**Notes:** AirTrunk is NVIDIA DGX-Ready certified as a colocation partner. They do not deploy their own GPUs -- tenants bring GPU hardware. Key facility: JHB1 (Johor Bahru, Malaysia) with 150MW+ capacity and 20MW+ direct-to-chip liquid cooling already deployed (one of the largest DLC deployments globally). MEL1 (Melbourne West) expanding by 100MW+. AirTrunk pioneers liquid cooling in partnership with NVIDIA Data Center. Specific GPU models at AirTrunk sites could not be verified -- they depend on the tenant.

---

## 15. NTT Data Centers / NTT DATA

| GPU/Accelerator | Facilities/Regions | Source |
|---|---|---|
| NVIDIA DGX (DGX-Ready certified) | Osaka 7 (OS7, Ibaraki City, Osaka Prefecture) | [NTT Com PR Oct 2024](https://www.ntt.com/en/about-us/press-releases/news/article/2024/1001.html) |
| NVIDIA DGX (DGX-Ready, scheduled Mar 2025) | Yokohama 1 Data Center | [NTT Com PR Oct 2024](https://www.ntt.com/en/about-us/press-releases/news/article/2024/1001.html) |
| NVIDIA HGX platforms (enterprise AI factories) | Global -- healthcare (cancer hospital, with Dell), automotive manufacturing, technology manufacturing | [NTT DATA PR Mar 2026](https://www.businesswire.com/news/home/20260311112934/en/NTT-DATA-Unveils-NVIDIA-Powered-Enterprise-AI-Factories-to-Support-Secure-AI-Adoption-and-Help-Clients-Drive-Measurable-ROI) |

**Notes:** NTT has two relevant entities: NTT Communications (data center colocation, DGX-Ready certified) and NTT DATA (IT services, deploys NVIDIA HGX for enterprise AI factories). Specific GPU models (H100 vs B200 vs GB200) at NTT facilities are not publicly disclosed. NTT DATA's AI factory initiative (Mar 2026) integrates NVIDIA AI infrastructure with NeMo and NIM microservices. The healthcare deployment uses NVIDIA HGX with Dell servers for radiology AI.

---

## Summary: Confidence Tiers

### HIGH CONFIDENCE (specific GPU model + facility confirmed)
| Operator | GPU | Facility | Type |
|---|---|---|---|
| Cologix | NVIDIA HGX B200 | Columbus OH, COL4 (Lambda tenant) | Colocation |
| CoreWeave | NVIDIA H100 | Multiple US sites | GPU Cloud |
| CoreWeave | NVIDIA H200 | UK (Crawley, London); Barcelona Spain | GPU Cloud |
| CoreWeave | NVIDIA GB200 NVL72 | Multiple US sites | GPU Cloud |
| CoreWeave | NVIDIA GB300 NVL72 | Switch facility | GPU Cloud |
| Hut 8 | NVIDIA H100 (1,000x, HPE Cray) | Chicago IL | GPU Cloud |
| OVHcloud | NVIDIA H100, H200, A100, L40S, L4 | Global (37 DCs) | Cloud Provider |
| OVHcloud | NVIDIA B200 HGX, AMD MI325X | Global (early access) | Cloud Provider |
| Flexential | NVIDIA H200 + AMD MI300X | Atlanta-Douglasville GA (DigitalOcean tenant) | Colocation |
| Equinix | NVIDIA DGX GB300, DGX B300 | 45 markets (NVIDIA Instant AI Factory) | Colocation/Managed |
| Digital Realty | NVIDIA Vera Rubin NVL72 | Manassas VA, Aurora 96MW (NVIDIA's own facility) | Colocation |

### MEDIUM CONFIDENCE (DGX-Ready certified but specific GPU models depend on tenant)
| Operator | Certification | Facilities |
|---|---|---|
| DataBank | NVIDIA DGX-Ready (Blackwell) | Atlanta, Denver, Dallas, New York, Minneapolis |
| QTS | NVIDIA DGX-Ready | 24 DCs, 900+ MW |
| CyrusOne | NVIDIA DGX-Ready | North America (Intelliscale, up to 300kW/rack) |
| AirTrunk | NVIDIA DGX-Ready | APAC: Australia, HK, Japan, Malaysia, Singapore |
| NTT | NVIDIA DGX-Ready | Osaka 7, Yokohama 1 |

### DATA GAPS (no verifiable GPU deployment info found)
| Operator | Notes |
|---|---|
| STACK Infrastructure | No GPU-specific announcements found. Colocation/hyperscale provider. |
| TierPoint | DCD whitepaper references GPU deployment but is gated; specific model unknown |
| Vantage Data Centers | Building massive AI campuses (1.4GW TX, NV) but no tenant GPU disclosures |

---

## Key Distinction: Colocation vs GPU Cloud

Most operators in this list are **colocation providers** who supply power, cooling, and space. They do NOT own GPUs. Their tenants (hyperscalers, GPU clouds like CoreWeave/Lambda, enterprises) bring their own GPU hardware.

Only these operators **own and deploy GPUs directly**:
- **CoreWeave** -- GPU cloud provider (~250K GPUs)
- **OVHcloud** -- cloud provider with own GPU fleet
- **Hut 8 / Highrise AI** -- GPUaaS (1,000 H100s confirmed)
- **Equinix** (upcoming, via NVIDIA Instant AI Factory managed service)
- **NTT DATA** (enterprise AI factory deployments)
