import pptxgen from "pptxgenjs";

export const createPresentation = async (deck: any, name: string, saveFile: boolean = true) => {
    console.log("createPresentation", deck, name)
    // 1. Create a Presentation
    let pres = new pptxgen();

    // create a slide for each item in the deckt
    deck.forEach((item: any) => {
    // 2. Add a Slide to the presentation
    let slide = pres.addSlide();

        // 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide
        slide.addText(item.title, {
            x: '10%',
            y: '10%',
            h: '25%',
            w: '80%',
            color: "363636",
            //fill: { color: "F1F1F1" },
            //fill: { color: "00FFFF" },
            align: pres.AlignH.center,
            fontSize: 40,
            fit: 'shrink',
            autoFit: true,
            isTextBox: true,
        });

        slide.addText(item.text, {
            x: '10%',
            y: '35%',
            h: '50%',
            w: '80%',
            color: "363636",
            //fill: { color: "F1F1F1" },
            //fill: { color: "F1F1F1" },
            align: pres.AlignH.center,
            fontSize: item.text.length > 500 ? 15 : 20,
            fit: 'shrink',
            autoFit: true,
            isTextBox: true
        });

    });

    // 4. Save the Presentation
    if (saveFile) {
        pres.writeFile({ fileName: `${name}.pptx` });
    } else {
        return await pres.write('blob');
        // pres.write('blob').then((blob: any) => { 
        //     return blob
        // });
    }
};
