'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

// This is a stubbed implementation that other packages use to record analytics data & performance.
module.exports = {

  /**
   * Track a set of values against a named event.
   * @param eventName Name of the event to be tracked.
   * @param values The object containing the data to track.
   */
  track: function track(key, values) {},

  /**
   * A no-op decorator factory (https://github.com/wycats/javascript-decorators). 
   */
  trackTiming: function trackTiming() {
    var eventName = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    return function (target, name, descriptor) {};
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS9kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL251Y2xpZGUtY2xpY2stdG8tc3ltYm9sL25vZGVfbW9kdWxlcy9udWNsaWRlLWFuYWx5dGljcy9saWIvYW5hbHl0aWNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7QUFZWixNQUFNLENBQUMsT0FBTyxHQUFHOzs7Ozs7O0FBT2YsT0FBSyxFQUFBLGVBQUMsR0FBVyxFQUFFLE1BQVcsRUFBRSxFQUFFOzs7OztBQUtsQyxhQUFXLEVBQUEsdUJBQStCO1FBQTlCLFNBQVMseURBQUMsSUFBSTs7QUFDeEIsV0FBTyxVQUFDLE1BQU0sRUFBTyxJQUFJLEVBQVUsVUFBVSxFQUFVLEVBQUUsQ0FBQztHQUMzRDtDQUNGLENBQUMiLCJmaWxlIjoiL2hvbWUvYW5kcmVpL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvbnVjbGlkZS1jbGljay10by1zeW1ib2wvbm9kZV9tb2R1bGVzL251Y2xpZGUtYW5hbHl0aWNzL2xpYi9hbmFseXRpY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4vLyBUaGlzIGlzIGEgc3R1YmJlZCBpbXBsZW1lbnRhdGlvbiB0aGF0IG90aGVyIHBhY2thZ2VzIHVzZSB0byByZWNvcmQgYW5hbHl0aWNzIGRhdGEgJiBwZXJmb3JtYW5jZS5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBUcmFjayBhIHNldCBvZiB2YWx1ZXMgYWdhaW5zdCBhIG5hbWVkIGV2ZW50LlxuICAgKiBAcGFyYW0gZXZlbnROYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHRyYWNrZWQuXG4gICAqIEBwYXJhbSB2YWx1ZXMgVGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBkYXRhIHRvIHRyYWNrLlxuICAgKi9cbiAgdHJhY2soa2V5OiBzdHJpbmcsIHZhbHVlczogYW55KSB7fSxcblxuICAvKipcbiAgICogQSBuby1vcCBkZWNvcmF0b3IgZmFjdG9yeSAoaHR0cHM6Ly9naXRodWIuY29tL3d5Y2F0cy9qYXZhc2NyaXB0LWRlY29yYXRvcnMpLiBcbiAgICovXG4gIHRyYWNrVGltaW5nKGV2ZW50TmFtZT1udWxsOiA/c3RyaW5nKTogYW55IHtcbiAgICByZXR1cm4gKHRhcmdldDogYW55LCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0b3I6IGFueSkgPT4ge307XG4gIH0sXG59O1xuIl19
//# sourceURL=/home/andrei/dotfiles/atom/packages/nuclide-click-to-symbol/node_modules/nuclide-analytics/lib/analytics.js
