export const ADMIN_A11Y=Object.freeze({
 keyboardNavigation:true,visibleFocus:true,semanticHeadings:true,formLabels:true,errorAssociation:true,statusAnnouncements:true,minTouchTargetPx:44,reducedMotionSupport:true
});
export function validateControl(control){const errors=[];if(!control?.label)errors.push("LABEL_REQUIRED");if(control?.interactive&&!control?.keyboardAction)errors.push("KEYBOARD_ACTION_REQUIRED");return errors;}
