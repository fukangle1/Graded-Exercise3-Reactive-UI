// Vue use:
new Vue({
  el: '#app',
  data: {
    // The value of form fields
    form: {
      fullName: '',
      dob: '',
      gender: '',
      totalVisitors: null,
      childrenCount: null,
      accommodation: '',
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvc: ''
    },
    // Error about every field
    errors: {
      fullName: '',
      dob: '',
      gender: '',
      selectedPlaces: '',
      totalVisitors: '',
      childrenCount: '',
      accommodation: '',
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvc: ''
    },
    generalError: '',
    places: [],                
    isLoadingPlaces: false,
    placesError: '',
    selectedPlaces: [],       
    accommodationOptions: [
      'No accommodation needed',
      'Forest View Hotel',
      'Totoro Family Inn',
      'Witch Valley Guesthouse',
      'Luxury Ghibli Resort'
    ],
    showSummary: false
  },
  mounted() {
    this.loadPlaces();        
  },
  methods: {
    // here is about asynchronous loading 
    async loadPlaces() {
      this.isLoadingPlaces = true;
      this.placesError = '';
      try {
        const response = await fetch('ghibli_park.json');
        if (!response.ok) throw new Error('Failed to load park data');
        const data = await response.json();
        this.places = data;
      } catch (err) {
        this.placesError = 'Unable to load Ghibli Park places. Please refresh.';
        console.error(err);
      } finally {
        this.isLoadingPlaces = false;
      }
    },
    // click the card
    togglePlace(place) {
      const index = this.selectedPlaces.findIndex(p => p.id === place.id);
      if (index === -1) {
        this.selectedPlaces.push(place);
      } else {
        this.selectedPlaces.splice(index, 1);
      }
      if (this.errors.selectedPlaces) this.errors.selectedPlaces = '';
    },
    // delete the wrong
    clearErrors() {
      this.errors = {
        fullName: '', dob: '', gender: '', selectedPlaces: '',
        totalVisitors: '', childrenCount: '', accommodation: '',
        cardName: '', cardNumber: '', expiry: '', cvc: ''
      };
      this.generalError = '';
    },
    // check the answer if all in
    validateForm() {
      let isValid = true;
      if (!this.form.fullName.trim()) {
        this.errors.fullName = 'Full name is required.';
        isValid = false;
      }
      if (!this.form.dob) {
        this.errors.dob = 'Date of birth is required.';
        isValid = false;
      }
      if (!this.form.gender) {
        this.errors.gender = 'Please select your gender.';
        isValid = false;
      }
      if (this.selectedPlaces.length === 0) {
        this.errors.selectedPlaces = 'Please select at least one Ghibli Park place.';
        isValid = false;
      }
      if (!this.form.totalVisitors || this.form.totalVisitors < 1) {
        this.errors.totalVisitors = 'Total visitors is required (min 1).';
        isValid = false;
      } else if (this.form.childrenCount === null || this.form.childrenCount === '') {
        this.errors.childrenCount = 'Number of children is required.';
        isValid = false;
      } else if (this.form.childrenCount > this.form.totalVisitors) {
        this.errors.childrenCount = 'Children cannot exceed total visitors.';
        isValid = false;
      }
      if (!this.form.accommodation) {
        this.errors.accommodation = 'Please select an accommodation option.';
        isValid = false;
      }
      if (!this.form.cardName.trim()) {
        this.errors.cardName = 'Name on card is required.';
        isValid = false;
      }
      if (!this.form.cardNumber.trim()) {
        this.errors.cardNumber = 'Card number is required.';
        isValid = false;
      }
      if (!this.form.expiry) {
        this.errors.expiry = 'Expiration date is required.';
        isValid = false;
      }
      if (!this.form.cvc.trim()) {
        this.errors.cvc = 'CVC is required.';
        isValid = false;
      }
      if (!isValid) {
        this.generalError = 'There are mandatory items pending to be filled. Please complete the required fields.';
      }
      return isValid;
    },
    // click" Generate Itinerary "
    generateItinerary() {
      this.clearErrors();
      this.showSummary = false;
      if (this.validateForm()) {
        this.showSummary = true;
      }
    },
    // only show the last 4 number
    maskCardNumber(card) {
      if (!card) return '—';
      let digits = card.replace(/\s/g, '');
      if (digits.length < 4) return '**** **** **** ****';
      let last4 = digits.slice(-4);
      return `**** **** **** ${last4}`;
    }
  }
});