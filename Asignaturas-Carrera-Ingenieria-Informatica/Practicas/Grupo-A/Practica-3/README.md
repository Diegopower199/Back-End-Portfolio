Partiendo de la solución del Examen Parcial se pide añadir la siguiente funcionalidad y datos

- Las citas médicas tendrdán un campo "id_doctor" de tipo string. Cuando el médico crea una cita deberá indicar su id (un string cualquiera).

- Al añadir una cita (por parte del médico) podrá haber varias citas en el mismo día, mes, año y hora, siempre y cuando sean de médicos distintos (es decir, un mismo médico no puede tener 2 citas a la vez, pero dos médicos distintos sí).

- Cuando los pacientes consultan las citas disponibles además del día, mes y año podrán añadir (o no, es opcional) el id_doctor, para ver las citas disponibles de un doctor particular.

- Cuando un paciente reserva una cita, además del día, hora, mes, año y su dni, deberá indicar el id_doctor.

- Se añadirá un nuevo endpoint: "/doctorAppointments/:id_doctor" en el que se devolverá un array con las citas ocupadas del doctor, con fecha igual o posterior a la que se hace la llamada al endpoint.

- Se añadirá un nuevo endpoint: "/patientAppointments/:dni" en el que se devolverá un array con las citas del paciente, con fecha igual o posterior a la que se hace la llamada al endpoint.
