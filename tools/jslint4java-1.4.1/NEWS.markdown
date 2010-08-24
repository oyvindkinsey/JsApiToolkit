Revision history for jslint4java
================================

1.4.1 (2010-08-05)
------------------

 * issue 40: StringIndexOutOfBoundsException on XmlResultFormatter.

1.4 (2010-07-27)
----------------

 * issue 35: Removed embedded JUnit.
 * issue 30: Add a "report" formatter to the ant task.
   * Also available on the command line with `--report`
 * issue 37: add a `--encoding` flag for specifying the encoding files on the command line.
 * issue 36: add a JUnit XML formatter.
 * issue 26: add support for `.data()` call in JSLINT.
   * This is only available in the Java API right now.
 * issue 39: add failureproperty to the ant task.
 * Use JCommander for flag processing.
   * **[INCOMPATIBILITY]** This means that command line option parsing has changed slightly.  You now have to say `--indent 2` instead of `--indent=2`.
   * **[INCOMPATIBILITY]** The minimum version of Java is now 6.
 * Update to JSLint 2010-07-14.
   * Adds options: es5, windows.
   * Removes options: sidebar.

1.3.3 (2009-12-02)
------------------

 * issue 8: add support for predef option.
 * Update to JSLint 2009-11-22
   * Adds "devel" option.

1.3.2 (2009-11-12)
------------------

 * issue 18: add support for external jslint.js.
 * issue 29: pretty up the docs some.
 * issue 32: clear up some non-partable tests.
 * Update to JSLint 2009-10-04.
   * Adds maxerr option.

1.3.1 (2009-07-30)
------------------

 * issue 21: Emit full filename in ant errors.
 * issue 22: Correct line & column numbers to be 1-based.
 * issue 23: State total error count in build failure message.
 * issue 24: make output more like javac for easier NetBeans parsing. (thanks, Ari Shamash!)
 * Update to JSLint 2009-07-25.

1.3 (2009-07-23)
----------------

 * **[INCOMPATIBILITY]** Rename package from net.happygiraffe.jslint to com.googlecode.jslint4java.  This means that the antlib url is now `antlib:com.googlecode.jslint4java`.
 * Add support for the indent option.
 * Switch build to maven.
 * Update to JSLint 2009-07-08.

1.2.1 (2008-09-07)
------------------

 * Recompile with Java 5.

1.2 (2008-09-07)
----------------

 * **[INCOMPATIBILITY]** Rewrite the ant task so that it always uses filesets.
 * **[INCOMPATIBILITY]** Rewrite the ant task so that it always uses filesets.
 * **[INCOMPATIBILITY]** Move antlib to be antlib:net.happygiraffe.jslint.
 * Update to JSLint 2008-09-04.
 * Add a `report()` call to get at `JSLINT.report()`.
 * Add in a formatter subelement to the jslint ant task.  Output can now be in either XML or plain text and may be written to a file.
 * **[INCOMPATIBILITY]** Default to failing the build if all files do not pass JSLint.  Add a haltonfailure attribute to disable this.

1.1 (2007-07-30)
----------------

 * Update to JSLint 2007-07-29.
 * Fixed Issue 1, a NullPointerException when encountering a fatal error.  Many thanks to Rod McChesney for pointing this out.
 * Added an Ant task to run JSLint as part of the build.  See the javadoc for details.
 * Added a Ruby script to automatically extract options & descriptions from JSLint.
 * All option descriptions now start with upper case.
 * Added a proper distribution (& src dist) to the build script.
 * Added a `resetOptions()` call to JSLint.
 * Switch to a more normal Rhino function call in JSLint.lint().

1.0 (2007-07-16)
----------------

 * original version
