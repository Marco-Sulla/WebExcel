import BasePlugin from '../_base';
import { registerPlugin } from '../../plugins';

/**
 * @plugin TrimRows
 * @pro
 *
 * @description
 * The plugin allows to trim certain rows. The trimming is achieved by applying the transformation algorithm to the data
 * transformation. In this case, when the row is trimmed it is not accessible using `getData*` methods thus the trimmed
 * data is not visible to other plugins.
 *
 * @example
 * ```js
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   date: getData(),
 *   // hide selected rows on table initialization
 *   trimRows: [1, 2, 5]
 * });
 *
 * // access the trimRows plugin instance
 * const trimRowsPlugin = hot.getPlugin('trimRows');
 *
 * // hide single row
 * trimRowsPlugin.trimRow(1);
 *
 * // hide multiple rows
 * trimRowsPlugin.trimRow(1, 2, 9);
 *
 * // or as an array
 * trimRowsPlugin.trimRows([1, 2, 9]);
 *
 * // show single row
 * trimRowsPlugin.untrimRow(1);
 *
 * // show multiple rows
 * trimRowsPlugin.untrimRow(1, 2, 9);
 *
 * // or as an array
 * trimRowsPlugin.untrimRows([1, 2, 9]);
 *
 * // rerender table to see the changes
 * hot.render();
 * ```
 */
class TrimRows extends BasePlugin {
  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link AutoRowSize#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */
  isEnabled() {
    return !!this.hot.getSettings().trimRows;
  }

  /**
   * Enables the plugin functionality for this Handsontable instance.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }
    const settings = this.hot.getSettings().trimRows;

    if (Array.isArray(settings)) {
      this.hot.recordTranslator.setSkippedRows(settings);
    }

    super.enablePlugin();
  }

  /**
   * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
   */
  updatePlugin() {
    const settings = this.hot.getSettings().trimRows;

    if (Array.isArray(settings)) {
      this.disablePlugin();
      this.enablePlugin();
    }

    super.updatePlugin();
  }

  /**
   * Disables the plugin functionality for this Handsontable instance.
   */
  disablePlugin() {
    this.hot.recordTranslator.setSkippedRows([]);
    super.disablePlugin();
  }

  /**
   * Trims the rows provided in the array.
   *
   * @param {Number[]} rows Array of physical row indexes.
   * @fires Hooks#skipLengthCache
   * @fires Hooks#beforeTrimRow
   * @fires Hooks#afterTrimRow
   */
  trimRows(rows) {
    const currentTrimConfig = this.hot.recordTranslator.getSkippedRows();
    const isValidConfig = this.isValidConfig(rows);
    let destinationTrimConfig = currentTrimConfig;

    if (isValidConfig) {
      destinationTrimConfig = Array.from(new Set(currentTrimConfig.concat(rows)));
    }

    const allowTrimRow = this.hot.runHooks('beforeTrimRow', currentTrimConfig, destinationTrimConfig, isValidConfig);

    if (allowTrimRow === false) {
      return;
    }

    if (isValidConfig) {
      this.hot.recordTranslator.setSkippedRows(destinationTrimConfig);
    }

    this.hot.runHooks('afterTrimRow', currentTrimConfig, destinationTrimConfig, isValidConfig,
      isValidConfig && destinationTrimConfig.length > currentTrimConfig.length);
  }

  /**
   * Trims the row provided as physical row index (counting from 0).
   *
   * @param {...Number} row Physical row index.
   */
  trimRow(...row) {
    this.trimRows(row);
  }

  /**
   * Untrims the rows provided in the array.
   *
   * @param {Number[]} rows Array of physical row indexes.
   * @fires Hooks#skipLengthCache
   * @fires Hooks#beforeUntrimRow
   * @fires Hooks#afterUntrimRow
   */
  untrimRows(rows) {
    const currentTrimConfig = this.hot.recordTranslator.getSkippedRows();
    const isValidConfig = this.isValidConfig(rows);
    let destinationTrimConfig = currentTrimConfig;

    if (isValidConfig) {
      destinationTrimConfig = currentTrimConfig.filter(trimmedRow => rows.includes(trimmedRow) === false);
    }

    const allowUntrimRow = this.hot.runHooks('beforeUntrimRow', currentTrimConfig, destinationTrimConfig, isValidConfig);

    if (allowUntrimRow === false) {
      return;
    }

    if (isValidConfig) {
      this.hot.recordTranslator.setSkippedRows(destinationTrimConfig);
    }

    this.hot.runHooks('afterUntrimRow', currentTrimConfig, destinationTrimConfig, isValidConfig,
      isValidConfig && destinationTrimConfig.length < currentTrimConfig.length);
  }

  /**
   * Untrims the row provided as row index (counting from 0).
   *
   * @param {...Number} row Physical row index.
   */
  untrimRow(...row) {
    this.untrimRows(row);
  }

  /**
   * Checks if given row is hidden.
   *
   * @param physicalRow Physical row index.
   * @returns {Boolean}
   */
  isTrimmed(physicalRow) {
    return this.hot.recordTranslator.isSkippedRow(physicalRow);
  }

  /**
   * Untrims all trimmed rows.
   */
  untrimAll() {
    this.untrimRows([].concat(this.hot.recordTranslator.getSkippedRows()));
  }

  /**
   * Get if trim config is valid.
   *
   * @param {Array} trimmedRows List of physical row indexes.
   * @returns {Boolean}
   */
  isValidConfig(trimmedRows) {
    return trimmedRows.every(trimmedRow => (Number.isInteger(trimmedRow) && trimmedRow >= 0 && trimmedRow < this.hot.countSourceRows()));
  }
}

registerPlugin('trimRows', TrimRows);

export default TrimRows;
