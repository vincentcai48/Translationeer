# Translationeer Document

A Translationeer document can be created in your dashboard and is given a unique ID. A document created by you can only be accessed by you at the path `/document/[id]`. You must be authenticated to access a document, but you use a test document in [Test Mode](/documentation/testmode)

## Layout

Every document will have the original text on the left side (grey background) and space for the user's translation on the right side. 

Documents are divided into multiple sections. A document first created will have one section, the text being inputed from the dashboard or generate from a test template. You have the ability to easily create more sections.

The very top of the page there is the header, where you can toggle the language (in light blue, by default "Latin to English") and the translators. These will be useful for defintion lookups. You can also click the user icon (if authenticated) to go back to the dashboard, or links to the How to Guide and Documentation. Note that clicking any link will direct to another page, so make sure your document is saved.

You will see the name of the document at the top, and then a thin document header with a couple of icons. Below you will see the body of the document.

## Name

Click on the pen icon on the right side of the name to edit the name. When done editing, click the checkmark.

## Definitions

Definitions are shown in popups. Each popup can be dragged around using your mouse.  

On the top of a definiton popup, the word being looked up is shown, as well as a pen icon that can be clicked to edit the word. When the word is being edited, the popup cannot be dragged and text can be highlighted in the popup. Click the search icon to lookup the edited word. All definitions of the word will be re-looked up

The popup will show definitons from each of the enabled translators shown in the page header. The word will be looked up in the language specified in the page header. You can change the language or the enabled translators by hovering over them in the page header and clicking on the desired ones. When the language is changed, the translators list will be updated and the defintion re-looked up. When new translators are enabled, the word will be looked up in that new translator. 

It is often the case that the first word lookup will take a longer time than subsequent ones. 

Please note that some special characters in Latin, in particular long vowels, are escaped to be looked up as just regular vowels. 

## Breaking Off Text

Select any text from the left side to break it off into it's separate section. Common use cases include translating by sentence, line, paragraph or stanza.

An excerpt of the selected text will show in the document header, and a button will appear that says "break off text". Click this button to break the text off into it's own separate section.

Line breaks and spaces are supported for breaking off text.

When selected text is broken off, the selected text will be it's own section. If there is a portion of text before or after the selected text, that text will be in it's own section. This way, if the text is broken off in the middle of a section, there will be three sections created from one original section. If the selected text is at the beginning or end of the original section, two sections will be created.

If there is a translation written for a section that is split up by breaking off text, the entire translation will go in the **first section** of the resulting sections from the breaking off of the text. 

For example, if there are 4 sections in a document, and you break off text from the middle of the 2nd section, there will be 6 sections after you break off the text. The translation written for the original 2nd section will stay in the 2nd section, while the newly created 3rd and 4th sections will have an empty translation.

Please note that if breaking off text produces a section is just one character or a few spaces of text, Translationeer may automatically remove that section.

## Merging and Adding Sections

Merging sections refers to the process of combining the original texts and translations of two adjacent sections into one. 

Click the small button between the left and right sides and between the two sections you want to merge to merge the sections. The button will have two small arrows. 

Merging cannot be undone.

The texts and translations of the two sections will be placed right after each other in the new combined section.

You can also add a section by clicking the "+" button at the end of the document, also between the left and right sides. This will create a new section at the end of document with a blank text and translation.

## Editing Text

You may freely edit the translation of every section (the right side).

To edit the original text (the left side), click on the green edit icon in the top right corner of the original text section. Now you can freely edit the text. Click either "Done" or "cancel" to keep or discard the changes. Please note that you cannot break off text in a section when you are editing the left side. 

## Saving a Document

Translationeer documents are all auto-saved.

The icon on the left side of the document header shows the saving status of the document:
- Check Mark: All changes are saved
- Spinner: Waiting for changes or saving in progress
- Red Exclamation: Error saving

Do not exit a document until the checkmark is shown, or else all you changes will not be saved. 

### The Saving Process

Translationeer waits until the document has loaded and then waits ten seconds to perform a save. During these ten seconds, the spinner is shown. After that, it waits for it's next edit then waits ten seconds to save, and repeat.

## Settings

Click the gear icon on the right side of the document header. This will show the settings popup.

#### Display Settings:
- Font Size: 16px for small, 22px for medium, 28px for large
- Text-Translation Ratio: the width of the left/right sides of the document (For example, 40-60 means the left side is 40% of the screen width while the right side is 60%)

#### Copy Settings:
- Between each section: what text to put between each section when your translation is copied to clipboard.

## Copying Text

Click the "Copy" text on the right of the document header to copy all sections of your translation (the right side) to your clipboard. The text will say "Copied" if successful or "Error" if unsuccessful. You can toggle some copy settings in the settings popup.