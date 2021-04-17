module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  format_amount: (amount) => {
    // format large numbers with commas
    return parseInt(amount).toLocaleString();
  },
  get_emoji: () => {
    const randomNum = Math.random();

    // Return a random emoji
    if (randomNum > 0.7) {
      return `<span for="img" aria-label="lightbulb">💡</span>`;
    } else if (randomNum > 0.4) {
      return `<span for="img" aria-label="laptop">💻</span>`;
    } else {
      return `<span for="img" aria-label="gear">⚙️</span>`;
    }
  },

  if_neq: (id1, id2) => {
    if (id1 !== id2) {
      return true;
    } else {
      return false;
    }
  },

  if_eq: (val1, val2) => {
    if (val1 === val2) {
      return true;
    } else {
      return false;
    }
  },

  if_status_cat: (val1, val2) => {
    if (val1 === val2) {
      return `checked`;
    } else {
      return ``;
    }
  },
};
