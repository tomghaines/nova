import React from 'react';

interface MailContentProps {
  summary: string;
}

export const MailContent: React.FC<MailContentProps> = ({ summary }) => {
  return (
    <div
      style={{
        backgroundColor: 'black',
        width: '100%',
        height: 'auto',
        paddingTop: '20px',
        paddingBottom: '20px',
        fontFamily: 'Roboto, Arial, sans-serif '
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#EBEAE6',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Roboto, Arial, sans-serif'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src='https://ci3.googleusercontent.com/meips/ADKq_NbA_0xI__XcK7H9SM_jYXO8fuRM9sn4ddgwYuwEDtW7n-PkCPZP9Zihxqe8q2iq7CpMyUI0k9bW7KmHCnB3hl2wyKoRKYiWgLD7vrx0GQORAXP6ylTmEIyGvhgNxixT1PvuWh7MiJtwws18Bn2GOpC38cdo533DTWI=s0-d-e1-ft#https://mcusercontent.com/6e705fca45a55bd13c2f1b887/images/d726ef0e-c78b-e435-c357-21a5c3c92121.png'
            alt='birdy.ai logo'
            style={{ height: '70px' }}
          />
        </div>

        {/* Graphical Banner */}
        <div style={{ marginBottom: '20px' }}>
          <img
            src='https://ci3.googleusercontent.com/meips/ADKq_Nau2zZRabcHD99-M2gA_2Dggg3vOfq8U1LUKu8uKXH1oS_0JaSyLlJ9W824vC0zXOtAlO7yQhepn8d8i0WDOC4a_nZdd7H8PwPWWWtgufHkPRFaHqfUzD4hEhYtwZkTaYeuL5tBFhCo1B6yx-hFTQ36Y76jEsjBDBEk=s0-d-e1-ft#https://mcusercontent.com/6e705fca45a55bd13c2f1b887/images/4728bde3-02a1-a7ff-77df-d9c194276cf5.jpeg'
            alt='Web3 Trends Banner'
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>

        {/* Heading */}
        <h1
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000',
            marginTop: '20px',
            marginBottom: '20px'
          }}
        >
          Weekly Newsletter
        </h1>

        {/* Content */}
        <p
          style={{
            fontSize: '16px',
            textAlign: 'center',
            color: '#000',
            marginBottom: '20px'
          }}
        >
          Here's your weekly dose of insights and trends happening in the Web3
          world. Stay updated with the latest market shifts and narratives
          dominating the space.
        </p>

        {/* Summary - Directly insert HTML content */}
        <div
          style={{
            marginBottom: '20px',
            color: '#000',
            fontSize: '16px',
            fontFamily: 'Roboto, Arial, sans-serif'
          }}
          dangerouslySetInnerHTML={{ __html: summary }}
        ></div>

        {/* Call-to-Action Button */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <a
            href='https://localhost:3000/home'
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontFamily: 'Roboto, Arial, sans-serif'
            }}
          >
            Read the Full Analysis
          </a>
        </div>
      </div>

      {/* CAN-SPAM Bar */}
      <div
        style={{
          maxWidth: '600px',
          margin: '20px auto',
          padding: '20px',
          backgroundColor: '#EBEAE6',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '12px',
          color: '#666',
          textAlign: 'left'
        }}
      >
        {/* Table */}
        <table style={{ width: '100%', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: '50%',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                <img
                  src='https://ci3.googleusercontent.com/meips/ADKq_NbA_0xI__XcK7H9SM_jYXO8fuRM9sn4ddgwYuwEDtW7n-PkCPZP9Zihxqe8q2iq7CpMyUI0k9bW7KmHCnB3hl2wyKoRKYiWgLD7vrx0GQORAXP6ylTmEIyGvhgNxixT1PvuWh7MiJtwws18Bn2GOpC38cdo533DTWI=s0-d-e1-ft#https://mcusercontent.com/6e705fca45a55bd13c2f1b887/images/d726ef0e-c78b-e435-c357-21a5c3c92121.png'
                  alt='birdy.ai logo'
                  style={{ height: '70px' }}
                />
              </td>
              <td
                style={{ width: '50%', paddingLeft: '10px', textAlign: 'left' }}
              >
                <p style={{ margin: '5' }}>
                  Contact us at{' '}
                  <a
                    href='mailto:contact@birdy.ai'
                    style={{ color: '#666', textDecoration: 'underline' }}
                  >
                    contact@birdy.ai
                  </a>
                  .
                  <br />
                  <em>Don't want to receive these emails?</em>&nbsp;&nbsp;
                  <a
                    href='https://gmail.us11.list-manage.com/unsubscribe?u=6e705fca45a55bd13c2f1b887&amp;id=5da8150776&amp;t=b&amp;e=[UNIQID]&amp;c=842aeb8ae6'
                    style={{ color: '#666', textDecoration: 'underline' }}
                  >
                    Unsubscribe
                  </a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MailContent;
