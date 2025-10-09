export const phishingEmails = [
  {
    id: 1,
    subject: "Urgent: Verify your account now",
    from: "support@secure-payments.example.com",
    body:
      "Dear user,\n\nWe detected suspicious activity on your account. Please verify your identity immediately by clicking the link below to avoid suspension:\n\nhttps://secure-payments.example.verify-account.example.com/\n\nThank you,\nSupport Team",
    isPhishing: true,
    hint: "Look at the link domain and the urgent, fear-based language."
  },
  {
    id: 2,
    subject: "Your Netflix invoice for March",
    from: "billing@netflix.com",
    body:
      "Hi John,\n\nYour regular Netflix invoice of $9.99 has been processed. If you have questions, see your account page at https://www.netflix.com/account\n\nThanks,\nNetflix Billing",
    isPhishing: false,
    hint: "Sender domain is official-looking and the message uses normal billing wording without urgent pressure."
  },
  {
    id: 3,
    subject: "Action required: Password reset",
    from: "no-reply@mybank.example",
    body:
      "We received a request to reset the password for user john.doe. If this wasn't you, please reply with your full name and last transaction ID so we can verify your identity.",
    isPhishing: true,
    hint: "Banks never ask for account details by replying to email. Also 'reply with' sensitive data is a red flag."
  },
  {
    id: 4,
    subject: "Team lunch this Friday",
    from: "kate@company.example",
    body:
      "Hey team,\n\nLet's meet for lunch this Friday at 12:30. RSVP in the calendar invite attached.\n\n— Kate",
    isPhishing: false,
    hint: "Casual internal tone, known coworker address and context — likely legitimate."
  },
  {
    id: 5,
    subject: "You've won a prize!",
    from: "prizes@contest.example",
    body:
      "Congratulations! You've been selected to receive a $1,000 gift card. Click here to claim: http://claim-prize.example.com/?id=12345. Provide your credit card for 'processing'.",
    isPhishing: true,
    hint: "Unexpected prize + asks for credit card information = classic scam."
  },
  {
    id: 6,
    subject: "Monthly project status report",
    from: "pm@company.example",
    body:
      "Attached is the monthly status report and the slides for the client meeting. Please review before Tuesday and add comments to the shared doc.",
    isPhishing: false,
    hint: "Work-related, expected attachment reference, internal sender domain — likely safe."
  },
  {
    id: 7,
    subject: "Payroll update — immediate action needed",
    from: "hr-payroll@company.example.payrollservice.com",
    body:
      "Hello,\n\nDue to a payroll processing error, we need you to confirm your bank routing number. Click the link to verify: https://company-payroll.example.com/verify\n\nHR",
    isPhishing: true,
    hint: "Sender domain looks suspiciously long; payroll services rarely request bank details via link."
  },
  {
    id: 8,
    subject: "Invitation: Security awareness webinar",
    from: "security-team@company.example",
    body:
      "Colleagues,\n\nJoin our security awareness webinar next Wednesday 3pm. No registration required; the calendar invite has the join link. — Security Team",
    isPhishing: false,
    hint: "Internal sender and predictable corporate training invite — likely legitimate."
  }
];