# AZ-900 Exam Categories

## Official Microsoft Exam Domains

The AZ-900 certification exam covers the following domains, which are now properly implemented in the application:

### 1. **Cloud-Concepts** (25-30% of exam)
Describe cloud concepts including:
- Cloud computing basics
- Cloud service models (IaaS, PaaS, SaaS)
- Cloud deployment models (Public, Private, Hybrid)
- Consumption-based model
- CapEx vs OpEx
- Scalability, Elasticity, and Agility
- High Availability, Fault Tolerance, and Disaster Recovery
- Shared Responsibility Model

**Keywords:** cloud computing, cloud model, iaas, paas, saas, public cloud, private cloud, hybrid cloud, serverless, capex, opex, scalability, elasticity, high availability, disaster recovery, shared responsibility

---

### 2. **Azure-Architecture-Services** (35-40% of exam)
Describe Azure architecture and services including:
- Azure Regions, Availability Zones
- Resource Groups, Subscriptions, Management Groups
- Compute services (VMs, App Service, Containers, Azure Functions, AKS)
- Storage services (Blob, Files, Queue, Table, Disk)
- Networking services (VNet, VPN Gateway, ExpressRoute, DNS)
- Database services (Azure SQL, Cosmos DB, Synapse)
- Azure Marketplace

**Keywords:** region, availability zone, resource group, subscription, management group, virtual machine, vm, app service, container, azure functions, aks, storage, blob, file share, vnet, vpn, sql, cosmos db

---

### 3. **Management-Governance** (30-35% of exam)
Describe Azure management and governance including:
- Cost Management and pricing
- Pricing Calculator, TCO Calculator
- Azure Policy, Resource Locks, Blueprints
- Azure Portal, Cloud Shell, PowerShell, Azure CLI
- ARM Templates (Azure Resource Manager)
- Azure Monitor, Azure Advisor, Service Health
- Azure Arc
- Service Level Agreements (SLAs)

**Keywords:** cost management, pricing calculator, tco, azure policy, resource lock, blueprint, governance, azure portal, cloud shell, powershell, cli, arm template, azure monitor, advisor, service health, sla

---

### 4. **Security-Compliance-Trust** (overlapping with other domains)
Describe security, privacy, compliance, and trust including:
- Authentication and Authorization
- Azure Active Directory (Microsoft Entra ID)
- Role-Based Access Control (RBAC)
- Multi-Factor Authentication (MFA)
- Microsoft Defender for Cloud, Azure Security Center
- Azure Key Vault
- Network Security (NSG, Firewall, DDoS Protection)
- Compliance offerings (GDPR, ISO, NIST)
- Microsoft Trust Center
- Encryption and Certificates

**Keywords:** security, authentication, authorization, azure active directory, azure ad, entra, rbac, mfa, security center, microsoft defender, sentinel, key vault, firewall, ddos, nsg, compliance, gdpr, trust center, encryption

---

### 5. **General** (Fallback Category)
Questions that don't fit clearly into the above categories.

---

## Changes from Previous Implementation

### ❌ Old Categories (Removed)
- `cloud-concepts` (lowercase)
- `core-services` (generic name)
- `security-privacy-compliance` (too long)
- `pricing-support` (incomplete)

### ✅ New Categories (Current)
- `Cloud-Concepts` (PascalCase, aligned with exam)
- `Azure-Architecture-Services` (matches official exam domain)
- `Management-Governance` (comprehensive coverage)
- `Security-Compliance-Trust` (clear and complete)
- `General` (fallback)

## Benefits

1. **Aligned with Microsoft Exam** - Categories now match the official AZ-900 exam outline
2. **Better Coverage** - More comprehensive keyword matching
3. **Clearer Organization** - Domain names clearly indicate what's covered
4. **Consistent Naming** - PascalCase matches AI-900 category style
5. **More Accurate Auto-Categorization** - Improved keyword detection for better auto-assignment

## Usage

### In Seed Data File
The `determineObjective()` function in `lib/seed-data-az900.ts` automatically categorizes questions based on content keywords.

### In Manual Import
The admin panel's manual import feature uses the same categorization logic to automatically assign categories to pasted questions.

### In Practice/Exam Mode
Users can filter questions by these categories when practicing or taking exams.

## Example Question Categorization

### Cloud-Concepts
> "What is the difference between CapEx and OpEx in cloud computing?"

### Azure-Architecture-Services
> "Which Azure service should you use to host a containerized application?"

### Management-Governance
> "What tool would you use to estimate the cost of running a workload in Azure?"

### Security-Compliance-Trust
> "Which Azure service provides multi-factor authentication capabilities?"

## Notes for Content Creators

When adding questions:
- Use relevant keywords from the category you want
- Questions may match multiple categories (first match wins)
- Review auto-assigned categories and adjust if needed
- `General` category indicates the question needs better keywords or manual categorization

## Official Microsoft Resources

- [AZ-900 Exam Page](https://learn.microsoft.com/en-us/certifications/exams/az-900)
- [AZ-900 Study Guide](https://learn.microsoft.com/en-us/certifications/resources/study-guides/az-900)
- [Azure Fundamentals Learning Path](https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/)
