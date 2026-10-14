package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.StudioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VideoEditorScreen(
    viewModel: StudioViewModel,
    onBack: () -> Unit
) {
    var selectedTool by remember { mutableStateOf("Color Grading") }
    var playbackSpeed by remember { mutableStateOf(1.0f) }
    var volume by remember { mutableStateOf(80f) }
    var chromaKeyEnabled by remember { mutableStateOf(false) }

    // Color Grading & Filters State
    var brightness by remember { mutableFloatStateOf(0f) }
    var contrast by remember { mutableFloatStateOf(1.0f) }
    var saturation by remember { mutableFloatStateOf(1.0f) }
    var temperature by remember { mutableFloatStateOf(0f) }
    var vignette by remember { mutableFloatStateOf(0f) }
    var activeLutFilter by remember { mutableStateOf("Cinematic") }

    var showExportDialog by remember { mutableStateOf(false) }
    var exportQuality by remember { mutableStateOf("1080p") }
    var isExporting by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Advanced Video Editor", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack, modifier = Modifier.testTag("back_button")) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Button(
                        onClick = { showExportDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                        modifier = Modifier.testTag("export_video_button")
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Export")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Preview / Canvas Area
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .background(Color.Black),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.PlayCircle,
                        contentDescription = "Preview",
                        tint = Color.White,
                        modifier = Modifier.size(72.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Preview: Vlog Ep 1 - Mumbai Street Food",
                        color = Color.White,
                        fontSize = 14.sp
                    )
                    Text(
                        "LUT: $activeLutFilter • Brightness: ${brightness.toInt()} • Sat: ${String.format("%.1f", saturation)}x",
                        color = Color.Gray,
                        fontSize = 12.sp
                    )
                }
            }

            // Timeline Tracks Section
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp),
                shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Multi-Track Timeline", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            IconButton(onClick = { }, modifier = Modifier.size(28.dp)) {
                                Icon(Icons.Default.Undo, contentDescription = "Undo", modifier = Modifier.size(16.dp))
                            }
                            IconButton(onClick = { }, modifier = Modifier.size(28.dp)) {
                                Icon(Icons.Default.Redo, contentDescription = "Redo", modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    // Simulated Tracks
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        VideoTimelineTrackBar("Video Track", Color(0xFFE91E63), "Clip 1 [00:00 - 02:10] • $activeLutFilter LUT")
                        VideoTimelineTrackBar("Audio Track", Color(0xFF00BCD4), "BGM: Lo-Fi Chill Beats")
                        VideoTimelineTrackBar("Text / Subtitles", Color(0xFFFF9800), "Auto Captions (Hinglish)")
                    }
                }
            }

            // Editing Tools Bottom Bar
            Surface(
                modifier = Modifier.fillMaxWidth(),
                tonalElevation = 8.dp
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        VideoToolChip("Color Grading", selectedTool == "Color Grading") { selectedTool = "Color Grading" }
                        VideoToolChip("Trim", selectedTool == "Trim") { selectedTool = "Trim" }
                        VideoToolChip("Split", selectedTool == "Split") { selectedTool = "Split" }
                        VideoToolChip("Speed", selectedTool == "Speed") { selectedTool = "Speed" }
                        VideoToolChip("Volume", selectedTool == "Volume") { selectedTool = "Volume" }
                        VideoToolChip("Chroma Key", chromaKeyEnabled) { chromaKeyEnabled = !chromaKeyEnabled }
                        VideoToolChip("Filters", selectedTool == "Filters") { selectedTool = "Filters" }
                        VideoToolChip("Keyframes", selectedTool == "Keyframes") { selectedTool = "Keyframes" }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Tool Adjuster Controls
                    when (selectedTool) {
                        "Color Grading" -> {
                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text("Cinematic LUT Filters:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                Row(
                                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    FilterChip(selected = activeLutFilter == "Cinematic", onClick = { activeLutFilter = "Cinematic" }, label = { Text("Cinematic") })
                                    FilterChip(selected = activeLutFilter == "Teal & Orange", onClick = { activeLutFilter = "Teal & Orange" }, label = { Text("Teal & Orange") })
                                    FilterChip(selected = activeLutFilter == "Moody", onClick = { activeLutFilter = "Moody" }, label = { Text("Moody") })
                                    FilterChip(selected = activeLutFilter == "Vintage", onClick = { activeLutFilter = "Vintage" }, label = { Text("Vintage") })
                                }

                                Spacer(modifier = Modifier.height(2.dp))

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("Brightness: ${brightness.toInt()}", fontSize = 11.sp, modifier = Modifier.width(90.dp))
                                    Slider(value = brightness, onValueChange = { brightness = it }, valueRange = -100f..100f, modifier = Modifier.weight(1f))
                                }
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("Contrast: ${String.format("%.1f", contrast)}x", fontSize = 11.sp, modifier = Modifier.width(90.dp))
                                    Slider(value = contrast, onValueChange = { contrast = it }, valueRange = 0.5f..2.0f, modifier = Modifier.weight(1f))
                                }
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("Saturation: ${String.format("%.1f", saturation)}x", fontSize = 11.sp, modifier = Modifier.width(90.dp))
                                    Slider(value = saturation, onValueChange = { saturation = it }, valueRange = 0.0f..2.0f, modifier = Modifier.weight(1f))
                                }
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("Temp: ${temperature.toInt()}K", fontSize = 11.sp, modifier = Modifier.width(90.dp))
                                    Slider(value = temperature, onValueChange = { temperature = it }, valueRange = -50f..50f, modifier = Modifier.weight(1f))
                                }
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("Vignette: ${vignette.toInt()}%", fontSize = 11.sp, modifier = Modifier.width(90.dp))
                                    Slider(value = vignette, onValueChange = { vignette = it }, valueRange = 0f..100f, modifier = Modifier.weight(1f))
                                }
                            }
                        }
                        "Speed" -> {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Speed: ${playbackSpeed}x", fontSize = 12.sp)
                                Slider(
                                    value = playbackSpeed,
                                    onValueChange = { playbackSpeed = it },
                                    valueRange = 0.25f..4.0f,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                        "Volume" -> {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Volume: ${volume.toInt()}%", fontSize = 12.sp)
                                Slider(
                                    value = volume,
                                    onValueChange = { volume = it },
                                    valueRange = 0f..200f,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                        else -> {
                            Text(
                                "Active Tool: $selectedTool — Tap timeline or adjust parameters.",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                            )
                        }
                    }
                }
            }
        }
    }

    if (showExportDialog) {
        AlertDialog(
            onDismissRequest = { showExportDialog = false },
            title = { Text("Export Video") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Select Quality & Resolution:")
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(selected = exportQuality == "720p", onClick = { exportQuality = "720p" }, label = { Text("720p") })
                        FilterChip(selected = exportQuality == "1080p", onClick = { exportQuality = "1080p" }, label = { Text("1080p") })
                        FilterChip(selected = exportQuality == "4K", onClick = { exportQuality = "4K" }, label = { Text("4K (Pro/Ad)") })
                    }
                    if (exportQuality == "4K") {
                        Text("4K export requires Pro Plan or watching 2 rewarded ads.", fontSize = 11.sp, color = MaterialTheme.colorScheme.error)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        isExporting = true
                        showExportDialog = false
                    }
                ) {
                    Text("Start Export")
                }
            },
            dismissButton = {
                TextButton(onClick = { showExportDialog = false }) { Text("Cancel") }
            }
        )
    }

    if (isExporting) {
        AlertDialog(
            onDismissRequest = { isExporting = false },
            title = { Text("Exporting Video ($exportQuality)...") },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    CircularProgressIndicator()
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Rendering color grading ($activeLutFilter LUT) & layers...")
                }
            },
            confirmButton = {
                Button(onClick = { isExporting = false }) { Text("Done / Save to Device") }
            }
        )
    }
}

@Composable
fun VideoTimelineTrackBar(trackName: String, color: Color, detail: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(28.dp)
            .background(color.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(trackName, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = color)
        Text(detail, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
    }
}

@Composable
fun VideoToolChip(label: String, selected: Boolean, onClick: () -> Unit) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = { Text(label, fontSize = 12.sp) }
    )
}
