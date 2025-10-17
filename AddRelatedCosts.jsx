import React, { useState } from 'react';
import { COLORS, OUT_NETWORK_DATA, IN_NETWORK_DATA, PRIMARY_PROCEDURE } from '../../utils/constants';
import { RELATED_COSTS } from '../../data';
import { formatCurrency } from '../../utils/formatters';
import { calculateTotalCosts } from '../../utils/calculations';

/**
 * White question mark icon component
 */
const WhiteQuestionMarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px', cursor: 'pointer' }}>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g fillRule="nonzero">
        <ellipse cx="11" cy="10.9605263" rx="11" ry="10.9605263" fill="#FFFFFF"></ellipse>
        <text 
          fontFamily="Roboto-Black, Roboto" 
          fontSize="17" 
          fontWeight="800" 
          fill="#362A69"
        >
          <tspan x="7.458333333" y="17">?</tspan>
        </text>
      </g>
    </g>
  </svg>
);

/**
 * Tab component for adding related procedure costs
 */
const AddRelatedCosts = ({ outOfNetworkPercentile, inNetworkPercentile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCosts, setSelectedCosts] = useState([]);

  const toggleCost = (costId) => {
    setSelectedCosts(prev =>
      prev.includes(costId) ? prev.filter(id => id !== costId) : [...prev, costId]
    );
  };

  const addAllCosts = () => {
    setSelectedCosts(RELATED_COSTS.map(cost => cost.id));
  };

  // Calculate totals
  const selectedItems = RELATED_COSTS.filter(cost => selectedCosts.includes(cost.id));
  const totalCosts = calculateTotalCosts(
    OUT_NETWORK_DATA[outOfNetworkPercentile],
    IN_NETWORK_DATA[inNetworkPercentile],
    selectedItems
  );

  return (
    <>
      {/* Header Row */}
      <div style={{ padding: '16px', backgroundColor: COLORS.primary }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 200px 200px 100px', 
          gap: '0 20px', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '18px', 
            paddingLeft: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            Add Possible Related Costs to the Total
            <WhiteQuestionMarkIcon />
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            fontWeight: 'bold', 
            backgroundColor: COLORS.secondaryTeal, 
            padding: '10px 12px 32px 12px', 
            position: 'relative', 
            height: '76px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start' 
          }}>
            <div style={{ fontSize: '12px' }}>
              Out-of-Network /<br />Uninsured Price
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '8px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              backgroundColor: '#ffeb99', 
              color: '#000', 
              fontSize: '11px', 
              fontWeight: 600, 
              padding: '2px 8px', 
              borderRadius: '10px', 
              whiteSpace: 'nowrap' 
            }}>
              {outOfNetworkPercentile}th percentile
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            fontWeight: 'bold', 
            backgroundColor: COLORS.red, 
            padding: '10px 12px 32px 12px', 
            position: 'relative', 
            height: '76px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start' 
          }}>
            <div style={{ fontSize: '12px' }}>In-Network Price</div>
            <div style={{ 
              position: 'absolute', 
              bottom: '8px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              backgroundColor: '#ffeb99', 
              color: '#000', 
              fontSize: '11px', 
              fontWeight: 600, 
              padding: '2px 8px', 
              borderRadius: '10px', 
              whiteSpace: 'nowrap' 
            }}>
              {inNetworkPercentile}th percentile
            </div>
          </div>
          
          <div></div>
        </div>
      </div>

      {/* Primary Procedure */}
      <div style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 200px 200px 100px', 
          gap: '0 20px', 
          padding: '16px' 
        }}>
          <div>
            <div style={{ 
              fontWeight: 500, 
              fontSize: '16px', 
              marginBottom: '4px', 
              color: '#1A2E3B' 
            }}>
              Primary Medical Procedure
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '18px', 
              marginBottom: '8px', 
              color: '#1A2E3B' 
            }}>
              {PRIMARY_PROCEDURE.title}
            </div>
            <div style={{ fontSize: '14px', color: '#000' }}>
              CPT Code: {PRIMARY_PROCEDURE.cptCode}
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            borderLeft: '1px solid #E5E7EB', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: COLORS.secondaryTeal, 
              marginBottom: '8px' 
            }}>
              {formatCurrency(OUT_NETWORK_DATA[outOfNetworkPercentile])}
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            borderLeft: '1px solid #E5E7EB', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: COLORS.red 
            }}>
              {formatCurrency(IN_NETWORK_DATA[inNetworkPercentile])}
            </div>
          </div>
          
          <div style={{ borderLeft: '1px solid #E5E7EB' }}></div>
        </div>
      </div>

      {/* Related Costs Section */}
      <div style={{ borderTop: '4px solid ' + COLORS.green }}>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            cursor: 'pointer',
            display: 'grid',
            gridTemplateColumns: '1fr 200px 200px 100px',
            gap: '0 20px',
            alignItems: 'center',
            backgroundColor: COLORS.green,
            padding: '16px',
            height: '64px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '8px' }}>
              {isExpanded ? '▼' : '▶'}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 500 }}>View Related Costs</span>
          </div>
          
          <div style={{ textAlign: 'center', color: 'white', fontSize: '14px' }}>
            Out-of-Network /<br />Uninsured Price
          </div>
          
          <div style={{ textAlign: 'center', color: 'white', fontSize: '14px' }}>
            In-Network<br />Price
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addAllCosts();
              }}
              style={{
                backgroundColor: '#fff',
                color: COLORS.green,
                fontSize: '16px',
                fontWeight: '600',
                border: '2px solid ' + COLORS.green,
                borderRadius: '6px',
                padding: '0 18px',
                height: '40px',
                cursor: 'pointer'
              }}
            >
              Add All
            </button>
          </div>
        </div>

        {/* Expanded Related Costs List */}
        {isExpanded && (
          <div style={{ backgroundColor: 'white' }}>
            {RELATED_COSTS.map((cost) => (
              <div
                key={cost.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 200px 200px 100px',
                  gap: '0 20px',
                  borderBottom: '1px solid #E5E7EB',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <input
                    type="checkbox"
                    checked={selectedCosts.includes(cost.id)}
                    onChange={() => toggleCost(cost.id)}
                    style={{ marginTop: '4px', marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, color: '#000', marginBottom: '4px' }}>
                      {cost.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#000' }}>
                      CPT Code: {cost.cptCode}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  textAlign: 'center', 
                  borderLeft: '1px solid #E5E7EB', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: COLORS.secondaryTeal 
                  }}>
                    {formatCurrency(cost.outOfNetworkPrice)}
                  </div>
                </div>
                
                <div style={{ 
                  textAlign: 'center', 
                  borderLeft: '1px solid #E5E7EB', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: COLORS.red 
                  }}>
                    {formatCurrency(cost.inNetworkPrice)}
                  </div>
                </div>
                
                <div style={{ 
                  borderLeft: '1px solid #E5E7EB', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <button
                    onClick={() => toggleCost(cost.id)}
                    style={{
                      backgroundColor: '#fff',
                      color: COLORS.green,
                      fontSize: '16px',
                      fontWeight: '600',
                      border: '2px solid ' + COLORS.green,
                      borderRadius: '6px',
                      padding: '0 18px',
                      height: '40px',
                      cursor: 'pointer'
                    }}
                  >
                    {selectedCosts.includes(cost.id) ? 'Remove' : 'Add'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total Cost Footer */}
      <div style={{ padding: '16px', backgroundColor: COLORS.primary }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 200px 200px 100px', 
          gap: '0 20px', 
          alignItems: 'center' 
        }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '28px' }}>
            Total Cost
          </div>
          
          <div style={{ textAlign: 'center', marginLeft: '20px' }}>
            <div style={{ 
              backgroundColor: COLORS.secondaryTeal, 
              padding: '12px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
                {formatCurrency(totalCosts.outOfNetwork)}
              </div>
            </div>
            <div style={{ color: 'white', fontSize: '12px', marginTop: '4px' }}>
              Out-of-Network/Uninsured Price
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginLeft: '20px' }}>
            <div style={{ 
              backgroundColor: COLORS.red, 
              padding: '12px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
                {formatCurrency(totalCosts.inNetwork)}
              </div>
            </div>
            <div style={{ color: 'white', fontSize: '12px', marginTop: '4px' }}>
              In-Network Price
            </div>
          </div>
          
          <div></div>
        </div>
      </div>
    </>
  );
};

export default AddRelatedCosts;