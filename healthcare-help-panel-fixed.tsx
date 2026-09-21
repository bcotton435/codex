import React, { useState } from 'react';
import { Search, X, MessageCircle, BookOpen, Download, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

// Custom Help Icon Component
const HelpIcon = ({ size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 34 34" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))' }}
  >
    <circle 
      cx="17" 
      cy="17" 
      r="17" 
      fill="#FFFFFF"
    />
    <text 
      x="17" 
      y="23" 
      textAnchor="middle" 
      fontSize="20" 
      fontWeight="bold" 
      fill="#4F4FAB"
      fontFamily="system-ui, -apple-system, Roboto, sans-serif"
    >
      ?
    </text>
  </svg>
);

// Help content data - organized by sections
const helpContent = {
  general: {
    title: "Understanding This Page",
    items: [
      {
        id: "network-difference",
        question: "What's the difference between In-Network and Out-of-Network prices?",
        answer: `In-Network providers have contracts with your insurance company and typically cost less. Out-of-Network providers don't have contracts with your insurer, so you'll pay more. 

Key differences:
• In-Network: Lower costs, predictable pricing, full insurance benefits
• Out-of-Network: Higher costs, you may pay full price upfront and get partial reimbursement`
      },
      {
        id: "related-costs",
        question: "What are Related Costs and why are they listed?",
        answer: `Medical procedures often involve multiple services beyond the main procedure:

• Anesthesia fees
• Pathology examination 
• Facility fees
• Doctor consultation fees

These are listed separately because they're often billed by different providers and may have different insurance coverage rates.`
      },
      {
        id: "facility-choice",
        question: "How do I choose a facility (Hospital vs ASC)?",
        answer: `Ambulatory Surgical Centers (ASCs) and Hospitals serve different needs:

**ASC Benefits:**
• Lower costs for routine procedures
• Specialized in outpatient procedures
• Shorter wait times

**Hospital Benefits:**
• Full range of services if complications arise
• Better for complex procedures
• Emergency care readily available`
      },
      {
        id: "price-range",
        question: "Why is there such a big price range?",
        answer: `Healthcare pricing varies widely due to:

• Different facility overhead costs
• Geographic location differences
• Provider experience and specialization
• Insurance negotiated rates
• Facility type (hospital vs. outpatient center)

That's why comparison shopping can save you thousands of dollars.`
      },
      {
        id: "cost-planning",
        question: "How should I use this information for planning?",
        answer: `Use this tool to make informed healthcare decisions:

**Before the procedure:**
• Compare in-network vs out-of-network costs
• Factor in related costs (anesthesia, pathology, etc.)
• Consider different facilities
• Check if travel for lower costs makes sense

**For budgeting:**
• Use 80th percentile for conservative planning
• Add related costs to get total estimate
• Factor in your deductible and coverage rates`
      }
    ]
  },
  reimbursementBasis: {
    title: "Reimbursement Basis Help",
    items: [
      {
        id: "reimbursement-methods",
        question: "What are the different reimbursement methods?",
        answer: `Insurance plans use different methods to calculate out-of-network reimbursements:

**UCR-Based**: Uses "usual, customary, and reasonable" charges
**Medicare-Based**: Uses Medicare fee schedule rates

Your plan determines which method to use. Check with your insurance company to understand their specific method, then adjust the settings to match your plan.`
      },
      {
        id: "ucr-vs-medicare",
        question: "What's the difference between UCR-Based and Medicare-Based?",
        answer: `**UCR-Based:**
• Based on what providers typically charge in your area
• Uses market rates from commercial insurance data
• Generally reflects higher, market-driven pricing

**Medicare-Based:**
• Uses standardized Medicare fee schedule rates
• Typically results in lower reimbursement amounts
• Used by some private plans that reference Medicare rates

**Important**: The Medicare-based method applies only to private health plans that reference Medicare rates, not actual Medicare coverage.`
      },
      {
        id: "which-method-to-choose",
        question: "How do I know which method my plan uses?",
        answer: `To determine your plan's method:

• **Check your insurance card** - Call the customer service number
• **Review plan documents** - Look for out-of-network benefit explanations
• **Ask specifically** - "Do you use UCR rates or Medicare-based rates for out-of-network reimbursement?"
• **Online member portal** - Check your plan's benefit details

Once you know your plan's method, select the corresponding option above for more accurate estimates.`
      }
    ]
  },
  chargesPercentile: {
    title: "Estimated Charges Percentile Help",
    items: [
      {
        id: "what-is-percentile",
        question: "What does the Estimated Charges Percentile mean?",
        answer: `The percentile represents what providers typically charge for this procedure in your geographic area:

**80th percentile** = 80% of providers charge this amount or less
**90th percentile** = 90% of providers charge this amount or less

We default to the 80th percentile because many insurers use this benchmark to determine "usual, customary, and reasonable" (UCR) rates for out-of-network reimbursement.`
      },
      {
        id: "why-80th-percentile",
        question: "Why is 80th percentile the default?",
        answer: `The 80th percentile is widely used by insurance companies as the standard for UCR-based reimbursement calculations:

• **Industry Standard**: Most insurers reference 80th percentile for "reasonable" charges
• **Balanced Estimate**: Covers majority of typical charges without being overly high
• **Reimbursement Alignment**: Matches what your insurer likely considers reasonable

You can adjust this setting if you know your plan uses a different percentile (such as 90th or 95th percentile).`
      },
      {
        id: "how-percentiles-calculated",
        question: "How are these percentiles calculated?",
        answer: `Percentiles are calculated using healthcare claims data:

• **Geographic Areas**: Based on your specific region (first 3 digits of ZIP code)
• **Claims Database**: Uses actual billed charges from healthcare providers
• **Procedure-Specific**: Calculated separately for each medical procedure code
• **Regular Updates**: Data is continuously updated to reflect current market rates

**Note**: Your actual costs may vary based on the specific provider, facility type, and your individual insurance plan terms.`
      }
    ]
  },
  reimbursementAmount: {
    title: "Estimated Reimbursement Help",
    items: [
      {
        id: "what-is-reimbursement",
        question: "What does Estimated Reimbursement mean?",
        answer: `The Estimated Reimbursement is the portion your insurance may pay for out-of-network services:

• **Varies by Plan**: Different insurers use different calculation methods
• **Plan-Specific**: Based on your plan's out-of-network benefit structure
• **Geographic Factors**: May vary by location and provider type

The default estimate assumes 70% reimbursement using the UCR-based method, but your actual reimbursement may differ.`
      },
      {
        id: "reimbursement-calculation-methods",
        question: "How do insurance plans calculate reimbursement?",
        answer: `Plans use different approaches:

**Percentage of Fee Schedule:**
• Some plans pay a percentage of Medicare fee schedule rates
• Others use a percentage of "usual, customary, and reasonable" (UCR) charges

**Plan Variables:**
• Your specific out-of-network benefit percentage
• Whether deductibles have been met
• Plan's definition of "reasonable" charges

Check your plan documents or call your insurer for your specific reimbursement method and percentage.`
      },
      {
        id: "network-vs-non-network",
        question: "How does out-of-network reimbursement differ from in-network?",
        answer: `Key differences in reimbursement:

**In-Network:**
• Pre-negotiated rates between provider and insurer
• Higher reimbursement percentages (often 80-90%)
• Predictable costs

**Out-of-Network:**
• No pre-negotiated rates
• Lower reimbursement percentages (often 60-70%)
• You may pay the difference between billed charges and reimbursement

**Important**: Out-of-network providers can bill you for amounts above what insurance reimburses, known as "balance billing."`
      },
      {
        id: "customizing-estimates",
        question: "How can I get more accurate reimbursement estimates?",
        answer: `To improve estimate accuracy:

**Contact Your Insurance:**
• Ask for your specific out-of-network reimbursement percentage
• Confirm whether they use UCR or Medicare-based calculations
• Request a pre-authorization if possible

**Adjust Settings:**
• Use the percentage slider to match your plan's reimbursement rate
• Select the correct reimbursement basis (UCR vs Medicare-based)
• Update the charges percentile if you know your plan's standard

**Remember**: These are estimates only. Actual reimbursement depends on your specific plan terms and may require pre-authorization.`
      }
    ]
  },
  cptCode: {
    title: "CPT Code Information",
    items: [
      {
        id: "what-is-cpt",
        question: "What is a CPT code?",
        answer: `CPT (Current Procedural Terminology) codes are standardized 5-digit codes that describe medical procedures and services:

• **Universal Language**: Used by all healthcare providers and insurers
• **Billing Standard**: Required for insurance claims and medical billing
• **Procedure Specific**: Each code represents a specific medical service
• **Example**: CPT 45380 = "Colonoscopy, flexible; with biopsy, single or multiple"`
      },
      {
        id: "where-find-cpt",
        question: "Where can I find my procedure's CPT code?",
        answer: `You can find CPT codes in several places:

**From Your Healthcare Provider:**
• Pre-procedure paperwork and estimates
• Medical bills and invoices
• After-visit summaries
• Insurance pre-authorization forms

**From Your Insurance:**
• Benefits explanations (EOBs)
• Pre-approval letters
• Online member portals

**Other Sources:**
• Hospital or clinic scheduling departments
• Medical coding websites
• Insurance company customer service`
      },
      {
        id: "why-cpt-important",
        question: "Why is the CPT code important for cost comparison?",
        answer: `CPT codes ensure you're comparing identical procedures:

**Accuracy**: Different procedures have different codes and costs
**Insurance Coverage**: Your benefits may vary by specific CPT code
**Provider Comparison**: Ensures quotes are for the exact same service
**Billing Clarity**: Helps verify you're charged for the correct procedure

**Example:**
• CPT 45378 (Diagnostic colonoscopy): ~$1,200
• CPT 45380 (Colonoscopy with biopsy): ~$1,800
• CPT 45385 (Colonoscopy with polyp removal): ~$2,400`
      },
      {
        id: "cpt-variations",
        question: "Are there different CPT codes for the same type of procedure?",
        answer: `Yes, procedures often have multiple related CPT codes:

**Base Procedure**: The standard version
**With Additions**: Codes for procedures with extra steps
• With biopsy
• With polyp removal
• With stent placement

**Bilateral vs Unilateral**: Some procedures differ if done on one or both sides

**Complexity Levels**: Some procedures have codes for different complexity levels

Always confirm the exact CPT code with your provider to ensure accurate cost estimates.`
      },
      {
        id: "multiple-cpt-codes",
        question: "What if my procedure involves multiple CPT codes?",
        answer: `Many procedures involve multiple CPT codes billed together:

**Primary Procedure**: Main service being performed
**Add-on Codes**: Additional services during the same session
**Facility Codes**: Separate codes for facility fees
**Anesthesia Codes**: Different codes for anesthesia services

**What to do:**
• Ask your provider for ALL CPT codes that will be used
• Get separate cost estimates for each code
• Check if any codes are bundled together
• Verify insurance coverage for each code individually

This ensures your total cost estimate includes all services.`
      }
    ]
  },
  rangeAnalysis: {
    title: "Price Range Analysis Help",
    items: [
      {
        id: "range-meaning",
        question: "What do the price ranges show?",
        answer: `The range bars show the spread of actual prices for this procedure:

• **Minimum**: Lowest price found in our data
• **Average**: Most common price (highlighted in white box)
• **Maximum**: Highest price found in our data

The bar width represents the relative cost - longer bars indicate higher average costs.`
      },
      {
        id: "average-vs-percentile",
        question: "What's the difference between Average and Percentile pricing?",
        answer: `**Average Pricing:**
• Simple mathematical average of all prices
• Good for understanding typical costs
• Shown in the range bars with white highlight

**Percentile Pricing:**
• Shows distribution across all prices
• Better for planning and budgeting
• Helps you understand cost variability

Use averages to understand typical costs, percentiles for financial planning.`
      }
    ]
  },
  median: {
    title: "Median Pricing Help",
    items: [
      {
        id: "median-explanation",
        question: "What does the median price represent?",
        answer: `The median is the middle price when all procedure costs are arranged from lowest to highest:

• 50% of procedures cost less than the median
• 50% of procedures cost more than the median
• Less affected by extremely high or low prices than the average
• Good baseline for typical procedure costs`
      },
      {
        id: "median-vs-average",
        question: "Should I use median or average for planning?",
        answer: `Both are useful for different purposes:

**Use Median when:**
• You want the most typical price
• Planning for a "middle-of-the-road" scenario
• Comparing different procedures

**Use Average when:**
• Looking at overall market pricing
• Understanding total cost trends
• Comparing with range analysis

For most planning, median gives you a realistic expectation of typical costs.`
      }
    ]
  },
  relatedCosts: {
    title: "Related Costs Help",
    items: [
      {
        id: "why-separate",
        question: "Why are related costs listed separately?",
        answer: `Medical procedures involve multiple providers who bill separately:

**Primary Procedure**: The main medical service
**Anesthesia**: Usually billed by anesthesiologist
**Pathology**: Lab analysis, billed by pathology group  
**Facility Fee**: Hospital/surgery center charges

Each may have different insurance coverage rates and provider networks.`
      },
      {
        id: "should-add-all",
        question: "Should I add all related costs to my estimate?",
        answer: `Not necessarily - it depends on your specific procedure:

**Always likely needed:**
• Facility fees for the location
• Anesthesia (if procedure requires sedation)

**Sometimes needed:**
• Pathology (only if tissue samples are taken)
• Additional consultations

Ask your doctor which services will be needed for your specific case.`
      },
      {
        id: "facility-types",
        question: "What's the difference between Hospital and ASC facility costs?",
        answer: `**Hospital Outpatient:**
• Higher facility fees due to full-service facility
• Better equipped for complex cases
• Emergency services readily available
• Generally more expensive

**Ambulatory Surgical Center (ASC):**
• Lower facility fees, specialized for outpatient procedures
• Streamlined operations = lower costs
• Limited to routine, low-risk procedures
• Can save significantly on facility fees`
      }
    ]
  },
  percentileAnalysis: {
    title: "Percentile Analysis Help",
    items: [
      {
        id: "percentile-meaning",
        question: "What do percentiles mean?",
        answer: `The Xth percentile means X% of all procedures cost this amount or less.

For example:
• 50th percentile = half of procedures cost less than this amount
• 80th percentile = 80% of procedures cost less, 20% cost more
• 90th percentile = 90% of procedures cost less, only 10% cost more

Higher percentiles show you the higher end of typical costs.`
      },
      {
        id: "which-percentile",
        question: "Which percentile should I use for planning?",
        answer: `• 50th percentile: Average case, good for initial budgeting
• 80th percentile: Conservative planning, covers most scenarios
• 90th percentile: Very conservative, covers nearly all cases

Most people use 80th percentile for financial planning as it gives a realistic high-end estimate while not being overly pessimistic.`
      }
    ]
  },
  calculator: {
    title: "Cost Calculator Help",
    items: [
      {
        id: "deductible-explained",
        question: "How does my deductible work?",
        answer: `Your deductible is the amount you pay before insurance starts covering costs.

**Example:** $2,000 deductible
• You pay the first $2,000 of medical costs
• After that, insurance covers their percentage (like 80%)
• If you've already met $1,000 this year, you only need to pay $1,000 more

Enter how much you've already paid toward your deductible this year for accurate estimates.`
      },
      {
        id: "coverage-percentage",
        question: "What is coverage percentage?",
        answer: `Coverage percentage is how much your insurance pays after you meet your deductible.

**Common coverage rates:**
• In-Network: 80-90% (you pay 10-20%)
• Out-of-Network: 60-70% (you pay 30-40%)

Check your insurance card or policy documents for your specific rates.`
      },
      {
        id: "estimate-accuracy",
        question: "How accurate are these estimates?",
        answer: `These are estimates for planning purposes. Actual costs may vary because:

• Your specific insurance plan may have different rates
• Some plans have out-of-pocket maximums
• Additional services may be needed
• Provider-specific pricing

Always get a pre-authorization and cost estimate from your provider before the procedure.`
      }
    ]
  },
  zipComparison: {
    title: "Location Comparison Help",
    items: [
      {
        id: "location-differences",
        question: "Why do costs vary by location?",
        answer: `Healthcare costs vary significantly by geographic area due to:

• Cost of living differences
• Provider competition levels
• Local regulations and taxes
• Facility overhead costs
• Regional market dynamics

Urban areas typically have higher costs but more provider options.`
      },
      {
        id: "travel-considerations",
        question: "Should I travel for procedures?",
        answer: `Consider these factors when evaluating travel:

**Potential Benefits:**
• Significant cost savings
• Access to specialized providers
• Shorter wait times

**Important Considerations:**
• Travel and lodging costs
• Follow-up care logistics
• Insurance coverage outside your area
• Recovery away from home support`
      }
    ]
  },
  outOfNetworkReimbursement: {
    title: "Out-of-Network Reimbursement Help",
    items: [
      {
        id: "modal-purpose",
        question: "What does this modal show?",
        answer: `This modal estimates your out-of-pocket costs when using out-of-network providers based on what your insurance may reimburse.

It calculates the difference between what providers charge and what your insurance will pay, showing your expected costs.`
      },
      {
        id: "charges-percentile-meaning",
        question: "What does Charges Percentile mean?",
        answer: `Charges Percentile shows the percentage of providers charging this amount or less in your area.

**Examples:**
• 80th percentile = 80% of providers charge this amount or less, 20% charge more
• 90th percentile = 90% of providers charge this amount or less, 10% charge more

Higher percentiles show higher typical charges in your market.`
      },
      {
        id: "est-reimbursement-meaning",
        question: "What is Est. Reimbursement?",
        answer: `Est. Reimbursement is the percentage your insurance pays of the total charges after applying their calculation method.

**Typical ranges:**
• Out-of-network: 60-80%
• Varies by your specific plan benefits

The remaining percentage becomes your out-of-pocket cost.`
      },
      {
        id: "reimbursement-methods-explained",
        question: "What are the reimbursement methods?",
        answer: `**UCR-Based**: Uses "usual, customary, and reasonable" rates based on local market pricing. Usually results in higher reimbursement.

**Medicare-Based**: Uses Medicare fee schedule rates as the baseline. Typically results in lower reimbursement amounts.

**Compare Both**: Shows estimates using both methods so you can see the range.

Check with your insurer to determine which method your plan uses.`
      },
      {
        id: "how-to-use-modal",
        question: "How do I use this tool?",
        answer: `**Steps to get accurate estimates:**

1. **Select your plan's reimbursement method** (contact your insurer if unsure)
2. **Adjust percentile and reimbursement %** to match your specific benefits
3. **Add needed services** like anesthesia or pathology
4. **Choose facility type** (Hospital vs ASC)

**Important**: These are estimates only. Contact your insurance for pre-authorization and exact coverage details before the procedure.`
      }
    ]
  }
};

const resourceLinks = [
  {
    icon: MessageCircle,
    text: "Contact us",
    action: "contact"
  },
  {
    icon: BookOpen,
    text: "View full glossary",
    action: "glossary"
  },
  {
    icon: Download,
    text: "Download print instructions",
    action: "print-instructions"
  }
];

// Individual Help Item Component
const HelpItem = ({ item, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <span className="text-sm font-medium text-gray-800 pr-2">{item.question}</span>
        {isExpanded ? (
          <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {item.answer}
          </div>
        </div>
      )}
    </div>
  );
};

// Help Section Component
const HelpSection = ({ title, items, expandedItems, onItemToggle }) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-3 px-4">
        {title}
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {items.map((item) => (
          <HelpItem
            key={item.id}
            item={item}
            isExpanded={expandedItems.includes(item.id)}
            onToggle={() => onItemToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Main Help Panel Component
const HelpPanel = ({ 
  isOpen, 
  onClose, 
  focusSection = null, 
  context = 'general' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);

  const handleItemToggle = (itemId) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleResourceClick = (action) => {
    switch (action) {
      case 'contact':
        console.log('Opening contact form');
        break;
      case 'glossary':
        console.log('Opening glossary');
        break;
      case 'print-instructions':
        console.log('Downloading print instructions');
        break;
      default:
        break;
    }
  };

  // Filter content based on search and focus
  const getFilteredContent = () => {
    if (!searchTerm) {
      // If focusing on a specific section, show ONLY that section
      if (focusSection && helpContent[focusSection]) {
        return [[focusSection, helpContent[focusSection]]];
      }
      // For general help, show ONLY the general section
      return [['general', helpContent.general]];
    }

    // When searching, search across ALL sections regardless of focus
    const filtered = {};
    const searchLower = searchTerm.toLowerCase();
    
    Object.entries(helpContent).forEach(([sectionKey, section]) => {
      const matchingItems = section.items.filter(item =>
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower)
      );
      
      if (matchingItems.length > 0) {
        filtered[sectionKey] = { ...section, items: matchingItems };
      }
    });
    
    return Object.entries(filtered);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 py-4 flex items-center justify-between" style={{ backgroundColor: '#4F4FAB' }}>
            <div className="flex items-center gap-2">
              <HelpIcon size={20} />
              <h2 className="text-lg font-semibold text-white">Need Help?</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search all help topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-gray-300 text-sm"
                  style={{ 
                    '--tw-ring-color': '#4F4FAB',
                    '--tw-ring-opacity': '0.5'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px rgba(79, 79, 171, 0.5)';
                    e.target.style.borderColor = '#4F4FAB';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                    e.target.style.borderColor = '#D1D5DB';
                  }}
                />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-xs text-gray-600">
                Searching across all {Object.keys(helpContent).length} help sections...
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {getFilteredContent().map(([sectionKey, section]) => (
              <HelpSection
                key={sectionKey}
                title={section.title}
                items={section.items}
                expandedItems={expandedItems}
                onItemToggle={handleItemToggle}
              />
            ))}

            {/* Resources Section */}
            <div className="mt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4 px-0">
                Still Need Help?
              </h3>
              <div className="space-y-2">
                {resourceLinks.map((resource) => (
                  <button
                    key={resource.action}
                    onClick={() => handleResourceClick(resource.action)}
                    className="w-full flex items-center gap-3 p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <resource.icon size={16} className="flex-shrink-0" style={{ color: '#4F4FAB' }} />
                    <span className="text-sm font-medium text-gray-800">{resource.text}</span>
                    <ExternalLink size={12} className="text-gray-400 ml-auto flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component to show usage
const HelpPanelDemo = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpFocusSection, setHelpFocusSection] = useState(null);

  const openHelp = (section = null) => {
    setHelpFocusSection(section);
    setIsHelpOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Healthcare Dashboard Help Panel with Global Search</h1>
        
        {/* All 12 Help Sections in Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          {/* Card 1: General Help */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">1. General Help</h3>
            <p className="text-xs text-gray-600 mb-3">Core understanding content</p>
            <button
              onClick={() => openHelp()}
              className="text-white px-3 py-2 text-sm rounded transition-colors w-full"
              style={{ backgroundColor: '#4F4FAB' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#3F3F8F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4F4FAB'}
            >
              Open General Help
            </button>
          </div>

          {/* Card 2: CPT Code */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">2. CPT Code Help</h3>
            <p className="text-xs text-gray-600 mb-2">From header area</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">CPT Code 45380</span>
              <button
                onClick={() => openHelp('cptCode')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 3: Reimbursement Basis */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">3. Reimbursement Basis</h3>
            <p className="text-xs text-gray-600 mb-2">From customizer modal</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">UCR vs Medicare</span>
              <button
                onClick={() => openHelp('reimbursementBasis')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 4: Charges Percentile */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">4. Charges Percentile</h3>
            <p className="text-xs text-gray-600 mb-2">From customizer</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">80th percentile</span>
              <button
                onClick={() => openHelp('chargesPercentile')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 5: Reimbursement Amount */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">5. Reimbursement %</h3>
            <p className="text-xs text-gray-600 mb-2">From customizer</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">70% coverage</span>
              <button
                onClick={() => openHelp('reimbursementAmount')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 6: Range Analysis */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">6. Range Analysis</h3>
            <p className="text-xs text-gray-600 mb-2">Range bars section</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">Price ranges</span>
              <button
                onClick={() => openHelp('rangeAnalysis')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 7: Median */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">7. Median Pricing</h3>
            <p className="text-xs text-gray-600 mb-2">Median module</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">Median values</span>
              <button
                onClick={() => openHelp('median')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 8: Percentile Analysis */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">8. Percentile Analysis</h3>
            <p className="text-xs text-gray-600 mb-2">Interactive chart</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">70th/80th/90th</span>
              <button
                onClick={() => openHelp('percentileAnalysis')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 9: Related Costs */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">9. Related Costs</h3>
            <p className="text-xs text-gray-600 mb-2">Additional services</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">Anesthesia, etc.</span>
              <button
                onClick={() => openHelp('relatedCosts')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 10: Calculator */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">10. Cost Calculator</h3>
            <p className="text-xs text-gray-600 mb-2">Insurance calculator</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">Deductibles, etc.</span>
              <button
                onClick={() => openHelp('calculator')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 11: Zip Comparison */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">11. Location Compare</h3>
            <p className="text-xs text-gray-600 mb-2">Zip code comparison</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">Regional costs</span>
              <button
                onClick={() => openHelp('zipComparison')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Card 12: Out-of-Network Reimbursement */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">12. Out-of-Network Modal</h3>
            <p className="text-xs text-gray-600 mb-2">Reimbursement calculator</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">Customize results</span>
              <button
                onClick={() => openHelp('outOfNetworkReimbursement')}
                className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#4F4FAB', fontSize: '10px' }}
              >
                ?
              </button>
            </div>
          </div>

        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Complete Integration Code:</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              <div>// All 12 help sections available:</div>
              <div>onClick={() => openHelp()} // General</div>
              <div>onClick={() => openHelp('cptCode')} // CPT</div>
              <div>onClick={() => openHelp('reimbursementBasis')} // Methods</div>
              <div>onClick={() => openHelp('chargesPercentile')} // Percentile</div>
              <div>onClick={() => openHelp('reimbursementAmount')} // Amount</div>
              <div>onClick={() => openHelp('rangeAnalysis')} // Ranges</div>
              <div>onClick={() => openHelp('median')} // Median</div>
              <div>onClick={() => openHelp('percentileAnalysis')} // Charts</div>
              <div>onClick={() => openHelp('relatedCosts')} // Costs</div>
              <div>onClick={() => openHelp('calculator')} // Calculator</div>
              <div>onClick={() => openHelp('zipComparison')} // Location</div>
              <div>onClick={() => openHelp('outOfNetworkReimbursement')} // Modal</div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-green-800 mb-2">Key Improvement:</h3>
          <p className="text-sm text-green-700 mb-2">
            <strong>Global Search:</strong> When you search for terms like "insurance" or "deductible", 
            you'll now see results from ALL relevant sections, not just the one you started from.
          </p>
          <p className="text-xs text-green-600">
            This makes the help system much more discoverable - users don't need to guess which section contains their answer!
          </p>
        </div>
      </div>

      {/* Help Panel */}
      <HelpPanel
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        focusSection={helpFocusSection}
      />
    </div>
  );
};

export default HelpPanelDemo;