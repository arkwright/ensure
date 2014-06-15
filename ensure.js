(function(){
  var root = this;

  var ensure = {
    _compareMode      : undefined, // <=
    _transformMode    : undefined, // shift
    _transformPadding : undefined, // ' '
    _filterMode       : undefined, // element
    _quantity         : undefined,

    /**
     * Specifies that the transform mode of the ensure chain
     * should be to pop an array, and executes the statement.
     */
    byPopping: function()
    {
      this._transformMode = 'pop';

      return this._execute();
    },

    /**
     * Specifies that the transform mode of the ensure chain
     * should be to push an array, and executes the statement.
     *
     * Pushed array elements receive a default value of undefined
     * if no value is provided.
     *
     * @param    mixed    value     The value to insert into pushed array elements.
     *                              Defaults to undefined.
     */
    byPushing: function(value)
    {
      this._transformMode = 'push';
      this._transformPadding = value;

      return this._execute();
    },

    /**
     * Specifies that the transform mode of the ensure chain
     * should be to shift an array, and executes the statement.
     */
    byShifting: function()
    {
      this._transformMode = 'shift';

      return this._execute();
    },

    /**
     * Specifies that the transform mode of the ensure chain
     * should be to unshift an array, and executes the statement.
     *
     * Unshifted array elements receive a default value of undefined
     * if no value is provided.
     *
     * @param    mixed    value     The value to insert into unshifted array elements.
     *                              Defaults to undefined.
     */
    byUnshifting: function(value)
    {
      this._transformMode = 'unshift';
      this._transformPadding = value;

      return this._execute();
    },

    /**
     * Compares the target to the quantity using the specified
     * comparison mode and filter.
     *
     * @return    object    Returns an object indicating the significance
     *                      and extent of the difference in the compared values.
     */
    _compare: function()
    {
      var acceptable,
          difference,
          targetQuantity;

      switch (this._filterMode)
      {
        case 'element':
          targetQuantity = this._target.length;
          break;
        default:
          break;
      }

      switch (this._compareMode)
      {
        case '<=':
          acceptable = targetQuantity <= this._quantity;
          difference = targetQuantity - this._quantity;
          break;
        case '>=':
          acceptable = targetQuantity >= this._quantity;
          difference = targetQuantity - this._quantity;
          break;
        default:
          break;
      }

      return {
        unacceptable : !acceptable,
        size         : Math.abs(difference)
      };
    },

    /**
     * Specifies that the filter for transforming the target
     * should be its number of elements.
     */
    elements: function()
    {
      this._filterMode = 'element';

      return this;
    },

    /**
     * Executes the ensure chain against the target.
     *
     * @return    mixed    Returns the transformed target.
     */
    _execute: function()
    {
      var difference = this._compare();

      if (difference.unacceptable)
      {
        // Transform mode of 'shift' will end up calling this._shift().
        this['_' + this._transformMode](difference.size);
      }

      return this._target;
    },

    /**
     * Specifies that the target should have at least this
     * many of the next filtered option.
     *
     * @param    integer    quantity    The quantity to check.
     */
    hasAtLeast: function(quantity)
    {
      this._quantity = quantity;
      this._compareMode = '>=';

      return this;
    },

    /**
     * Specifies that the target should have no more than this
     * many of the next filtered option.
     *
     * @param    integer    quantity    The quantity to check.
     */
    hasNoMoreThan: function(quantity)
    {
      this._quantity = quantity;
      this._compareMode = '<=';

      return this;
    },

    /**
     * Pops the specified number of elements off of the
     * end of the target array.
     *
     * @param    integer    numElements    The number of elements to remove.
     */
    _pop: function(numElements)
    {
      for (var i = 0; i < numElements; i++)
      {
        this._target.pop();
      }
    },

    /**
     * Pushes the specified number of elements onto of the
     * end of the target array.
     *
     * @param    integer    numElements    The number of elements to add. 
     */
    _push: function(numElements)
    {
      for (var i = 0; i < numElements; i++)
      {
        this._target.push(this._transformPadding);
      }
    },

    /**
     * Shifts the specified number of elements off of the
     * beginning of the target array.
     *
     * @param    integer    numElements    The number of elements to remove. 
     */
    _shift: function(numElements)
    {
      for (var i = 0; i < numElements; i++)
      {
        this._target.shift();
      }
    },

    /**
     * Specifies the target for the ensure statement.
     *
     * @param    mixed    First argument can be an object, array, primitive, or
     *                    the result of an expression. If an object or array,
     *                    ensure treats this argument as the target for transformation.
     * @param    string   Subsequent arguments are assumed to be target properties of the
     *                    object passed as the first argument. So, for example,
     *                    ensure.that(this,'first','second') instructs ensure to
     *                    treat `this.first.second` as the target of the transformation.
     *                    Internally, ensure is thinking: this['first']['second'].
     *                    This allows you to pass a primitive property of an object
     *                    to ensure() as though it were being passed-by-reference.
     */
    that: function()
    {
      this._compareMode      = undefined;
      this._transformMode    = undefined;
      this._transformPadding = undefined;
      this._filterMode       = undefined;
      this._quantity         = undefined;

      if (arguments.length === 0)
      {
        throw new Error('ensure.that() requires at least one argument!');
      }
      else if (arguments.length === 1)
      {
        this._target = arguments[0];
      }
      else
      {
        this._target = arguments[0];

        for (var i = 1; i < arguments.length; i++)
        {
          if (this._target[arguments[i]] === undefined)
          {
            throw new Error('ensure.that() could not find property: ' + arguments[i]);
          }

          this._target = this._target[arguments[i]];
        }
      }

      return this;
    },

    /**
     * Unshifts the specified number of elements onto of the
     * beginning of the target array.
     *
     * @param    integer    numElements    The number of elements to add. 
     */
    _unshift: function(numElements)
    {
      for (var i = 0; i < numElements; i++)
      {
        this._target.unshift(this._transformPadding);
      }
    },
  };

  root.ensure = ensure;
}).call(this);

var deck = [
  { history: ['A', 'B', 'C', 'D'] }
];

ensure.that(deck[0].history)
      .hasNoMoreThan(3)
      .elements()
      .byShifting();

console.log('TESTING SHIFTING');
console.log('deck[0].history.length should be 3 \n', deck[0].history.length === 3);
console.log('deck[0].history should contain values B,C,D \n', deck[0].history.join() === 'B,C,D');

var arr2 = [ 'A', 'B', 'C', 'D' ];

ensure.that(arr2)
      .hasNoMoreThan(2)
      .elements()
      .byPopping();

console.log('TESTING POPPING');
console.log('arr2.length should be 2 \n', arr2.length === 2);
console.log('arr2 should contain values A,B \n', arr2.join() === 'A,B');

var arr3 = [ 'A', 'B', 'C', 'D' ];

ensure.that(arr3)
      .hasAtLeast(6)
      .elements()
      .byUnshifting();

console.log('TESTING UNSHIFTING WITH NO ARGUMENT');
console.log('arr3.length should be 6 \n', arr3.length === 6);
console.log('arr3 should contain values ,,A,B,C,D \n', arr3.join() === ',,A,B,C,D');

var arr4 = [ 'A', 'B', 'C', 'D' ];

ensure.that(arr4)
      .hasAtLeast(6)
      .elements()
      .byUnshifting(' ');

console.log('TESTING UNSHIFTING WITH AN ARGUMENT');
console.log('arr4.length should be 6 \n', arr4.length === 6);
console.log('arr4 should contain values  , ,A,B,C,D \n', arr4.join() === ' , ,A,B,C,D');

var arr5 = [ 'A', 'B', 'C', 'D' ];

ensure.that(arr5)
      .hasAtLeast(6)
      .elements()
      .byPushing();

console.log('TESTING PUSHING');
console.log('arr5.length should be 6 \n', arr5.length === 6);
console.log('arr5 should contain values  A,B,C,D,, \n', arr5.join() === 'A,B,C,D,,');

var arr6 = [ 'A', 'B', 'C', 'D' ];

ensure.that(arr6)
      .hasAtLeast(6)
      .elements()
      .byPushing(' ');

console.log('TESTING PUSHING WITH AN ARGUMENT');
console.log('arr6.length should be 6 \n', arr6.length === 6);
console.log('arr6 should contain values  A,B,C,D, ,  \n', arr6.join() === 'A,B,C,D, , ');
